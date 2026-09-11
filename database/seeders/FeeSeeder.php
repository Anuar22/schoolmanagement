<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;

class FeeSeeder extends Seeder
{
    public function run(): void
    {
        $term = DB::table('terms')->where('is_active', true)->first();
        $students = DB::table('students')->get();

        if (!$term || $students->isEmpty()) return;

        // 1. Setup Categories
        $tuitionCatId = (string) Str::uuid();
        $activityCatId = (string) Str::uuid();

        DB::table('fee_categories')->insert([
            ['id' => $tuitionCatId, 'name' => 'Tuition & Academic Levy', 'description' => 'Core tuition', 'created_at' => now(), 'updated_at' => now()],
            ['id' => $activityCatId, 'name' => 'Sports & Extracurricular', 'description' => 'Activities', 'created_at' => now(), 'updated_at' => now()],
        ]);

        // 2. Generate Invoices for Students
        foreach ($students as $index => $student) {
            $invoiceId = (string) Str::uuid();
            $tuitionCost = 450000.00;
            $activityCost = 50000.00;
            $total = $tuitionCost + $activityCost; // 500,000

            // Simulate realistic statuses: some paid, some partial, some zero
            $paid = match ($index) {
                0 => 500000.00, // Fully Paid
                1 => 250000.00, // Partial
                2 => 300000.00, // Partial
                default => 0.00 // Unpaid
            };

            $status = match (true) {
                $paid >= $total => 'PAID',
                $paid > 0 => 'PARTIAL',
                default => 'UNPAID'
            };

            DB::table('fee_invoices')->insert([
                'id' => $invoiceId,
                'invoice_number' => 'INV-2026-' . str_pad((string)($index + 1), 4, '0', STR_PAD_LEFT),
                'student_id' => $student->id,
                'term_id' => $term->id,
                'total_amount' => $total,
                'paid_amount' => $paid,
                'due_date' => now()->addDays(30)->toDateString(),
                'status' => $status,
                'created_at' => now(),
                'updated_at' => now(),
            ]);

            // Add Items
            DB::table('fee_invoice_items')->insert([
                ['id' => (string) Str::uuid(), 'fee_invoice_id' => $invoiceId, 'fee_category_id' => $tuitionCatId, 'amount' => $tuitionCost, 'created_at' => now(), 'updated_at' => now()],
                ['id' => (string) Str::uuid(), 'fee_invoice_id' => $invoiceId, 'fee_category_id' => $activityCatId, 'amount' => $activityCost, 'created_at' => now(), 'updated_at' => now()],
            ]);

            // Record a payment if paid > 0
            if ($paid > 0) {
                DB::table('fee_payments')->insert([
                    'id' => (string) Str::uuid(),
                    'receipt_number' => 'REC-2026-' . str_pad((string)($index + 1), 4, '0', STR_PAD_LEFT),
                    'fee_invoice_id' => $invoiceId,
                    'amount' => $paid,
                    'payment_method' => 'Bank Transfer',
                    'reference_code' => 'CRDB-' . strtoupper(Str::random(6)),
                    'payment_date' => now()->subDays(2)->toDateString(),
                    'received_by' => 1,
                    'created_at' => now(),
                    'updated_at' => now(),
                ]);
            }
        }
    }
}