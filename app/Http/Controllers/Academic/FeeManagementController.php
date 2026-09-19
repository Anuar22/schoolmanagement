<?php

namespace App\Http\Controllers\Academic;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;
use Inertia\Inertia;
use App\Services\AuditLogger;

class FeeManagementController extends Controller
{
    public function index()
    {
        $term = DB::table('terms')->where('is_active', true)->first();

        // 1. Overall Financial Summary
        $totalInvoiced = DB::table('fee_invoices')->sum('total_amount') ?? 0;
        $totalCollected = DB::table('fee_invoices')->sum('paid_amount') ?? 0;
        $totalOutstanding = $totalInvoiced - $totalCollected;
        $collectionRate = $totalInvoiced > 0 ? round(($totalCollected / $totalInvoiced) * 100, 1) : 0;

        // 2. Student Invoices List
        $invoices = DB::table('fee_invoices')
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
            ->orderBy('fee_invoices.created_at', 'desc')
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
                'total_invoiced' => (float) $totalInvoiced,
                'total_collected' => (float) $totalCollected,
                'total_outstanding' => (float) $totalOutstanding,
                'collection_rate' => $collectionRate,
            ],
            'invoices' => $invoices,
        ]);
    }

    public function recordPayment(Request $request)
    {
        $validated = $request->validate([
            'invoice_id' => 'required|uuid',
            'amount' => 'required|numeric|min:1',
            'payment_method' => 'required|string|in:Bank Transfer,Mobile Money,Cash',
            'reference_code' => 'nullable|string|max:100',
        ]);

        $invoice = DB::table('fee_invoices')->where('id', $validated['invoice_id'])->first();
        if (!$invoice) {
            return back()->withErrors(['error' => 'Invoice not found']);
        }

        $newPaidTotal = (float) $invoice->paid_amount + (float) $validated['amount'];
        $newStatus = match (true) {
            $newPaidTotal >= (float) $invoice->total_amount => 'PAID',
            $newPaidTotal > 0 => 'PARTIAL',
            default => 'UNPAID'
        };

        DB::transaction(function () use ($validated, $invoice, $newPaidTotal, $newStatus) {
            // Log Payment Entry
            DB::table('fee_payments')->insert([
                'id' => (string) Str::uuid(),
                'receipt_number' => 'REC-' . strtoupper(Str::random(8)),
                'fee_invoice_id' => $invoice->id,
                'amount' => $validated['amount'],
                'payment_method' => $validated['payment_method'],
                'reference_code' => $validated['reference_code'] ?? null,
                'payment_date' => now()->toDateString(),
                'received_by' => auth()->id() ?? 1,
                'created_at' => now(),
                'updated_at' => now(),
            ]);

            // Update Invoice Paid Amount and Status
            DB::table('fee_invoices')->where('id', $invoice->id)->update([
                'paid_amount' => $newPaidTotal,
                'status' => $newStatus,
                'updated_at' => now(),
            ]);
        });

        return back()->with('success', 'Payment recorded successfully');
    }
}