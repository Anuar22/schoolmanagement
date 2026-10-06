<?php

namespace App\Http\Controllers\Academic;

use App\Http\Controllers\Controller;
use App\Services\AuditLogger;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;
use Inertia\Inertia;

class FeeManagementController extends Controller
{
    public function index(Request $request)
    {
        $user = $request->user();
        $tenantId = $user->tenant_id;

        $term = DB::table('terms')
            ->where('tenant_id', $tenantId)
            ->where('is_active', true)
            ->first();

        // 1. Overall Financial Summary Scoped to Tenant
        $totalInvoiced = (float) (DB::table('fee_invoices')
            ->where('tenant_id', $tenantId)
            ->sum('total_amount') ?? 0);

        $totalCollected = (float) (DB::table('fee_invoices')
            ->where('tenant_id', $tenantId)
            ->sum('paid_amount') ?? 0);

        $totalOutstanding = $totalInvoiced - $totalCollected;
        $collectionRate = $totalInvoiced > 0 ? round(($totalCollected / $totalInvoiced) * 100, 1) : 0;

        // 2. Student Invoices List
        $invoices = DB::table('fee_invoices')
            ->where('fee_invoices.tenant_id', $tenantId)
            ->join('students', 'fee_invoices.student_id', '=', 'students.id')
            ->join('classes', 'students.class_id', '=', 'classes.id')
            ->select(
                'fee_invoices.id as invoice_id',
                'fee_invoices.invoice_number',
                'fee_invoices.total_amount',
                'fee_invoices.paid_amount',
                'fee_invoices.status',
                'fee_invoices.due_date',
                'students.first_name',
                'students.last_name',
                'students.admission_number',
                'classes.name as class_name',
                'classes.stream'
            )
            ->orderByDesc('fee_invoices.created_at')
            ->get()
            ->map(function ($inv) {
                return [
                    'id' => $inv->invoice_id,
                    'invoice_number' => $inv->invoice_number,
                    'student_name' => "{$inv->last_name}, {$inv->first_name}",
                    'admission_number' => $inv->admission_number,
                    'class_name' => "{$inv->class_name} ({$inv->stream})",
                    'total_amount' => (float) $inv->total_amount,
                    'paid_amount' => (float) $inv->paid_amount,
                    'balance' => (float) ($inv->total_amount - $inv->paid_amount),
                    'status' => $inv->status,
                    'due_date' => $inv->due_date,
                ];
            });

        return Inertia::render('Academic/FeeLedger', [
            'term' => $term,
            'metrics' => [
                'total_invoiced' => $totalInvoiced,
                'total_collected' => $totalCollected,
                'total_outstanding' => $totalOutstanding,
                'collection_rate' => $collectionRate,
            ],
            'invoices' => $invoices,
        ]);
    }

    public function recordPayment(Request $request)
    {
        $user = $request->user();
        $tenantId = $user->tenant_id;

        $validated = $request->validate([
            'invoice_id' => 'required|uuid',
            'amount' => 'required|numeric|min:1',
            'payment_method' => 'required|string|in:Bank Transfer,Mobile Money,Cash',
            'reference_code' => 'nullable|string|max:100',
        ]);

        $invoice = DB::table('fee_invoices')
            ->where('tenant_id', $tenantId)
            ->where('id', $validated['invoice_id'])
            ->first();

        if (!$invoice) {
            return back()->withErrors(['error' => 'Invoice not found or unauthorized.']);
        }

        $currentBalance = (float) $invoice->total_amount - (float) $invoice->paid_amount;
        if ((float) $validated['amount'] > $currentBalance) {
            return back()->withErrors(['amount' => 'Payment amount cannot exceed the outstanding balance.']);
        }

        $paymentId = (string) Str::uuid();
        $receiptNumber = 'REC-' . strtoupper(Str::random(8));
        $newPaidTotal = (float) $invoice->paid_amount + (float) $validated['amount'];

        $newStatus = match (true) {
            $newPaidTotal >= (float) $invoice->total_amount => 'PAID',
            $newPaidTotal > 0 => 'PARTIAL',
            default => 'UNPAID'
        };

        DB::transaction(function () use ($validated, $invoice, $newPaidTotal, $newStatus, $tenantId, $user, $paymentId, $receiptNumber) {
            // 1. Log Payment Entry
            DB::table('fee_payments')->insert([
                'id' => $paymentId,
                'tenant_id' => $tenantId,
                'receipt_number' => $receiptNumber,
                'fee_invoice_id' => $invoice->id,
                'amount' => $validated['amount'],
                'payment_method' => $validated['payment_method'],
                'reference_code' => $validated['reference_code'] ?? null,
                'payment_date' => now()->toDateString(),
                'received_by' => $user->id,
                'created_at' => now(),
                'updated_at' => now(),
            ]);

            // 2. Update Invoice Paid Amount and Status
            DB::table('fee_invoices')
                ->where('tenant_id', $tenantId)
                ->where('id', $invoice->id)
                ->update([
                    'paid_amount' => $newPaidTotal,
                    'status' => $newStatus,
                    'updated_at' => now(),
                ]);

            // 3. Write Immutable Audit Trail
            AuditLogger::record(
                action: 'FEE_PAYMENT_RECORDED',
                entityType: 'FeePayment',
                entityId: $paymentId,
                oldValues: [
                    'invoice_id' => $invoice->id,
                    'previous_paid' => (float) $invoice->paid_amount,
                    'previous_balance' => (float) ($invoice->total_amount - $invoice->paid_amount),
                    'previous_status' => $invoice->status,
                ],
                newValues: [
                    'amount_paid' => (float) $validated['amount'],
                    'new_paid_total' => $newPaidTotal,
                    'new_balance' => (float) ($invoice->total_amount - $newPaidTotal),
                    'new_status' => $newStatus,
                    'receipt_number' => $receiptNumber,
                    'payment_method' => $validated['payment_method'],
                ]
            );
        });

        return back()->with('success', 'Payment recorded successfully.');
    }
}