<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        // 1. Fee Structure Categories (Tuition, Boarding, Exam Fees, Transport)
        Schema::create('fee_categories', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->string('name'); // e.g. "Tuition Fee", "Laboratory Levy"
            $table->text('description')->nullable();
            $table->timestamps();
        });

        // 2. Invoices generated per student per term
        Schema::create('fee_invoices', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->string('invoice_number')->unique();
            $table->foreignUuid('student_id')->constrained('students')->cascadeOnDelete();
            $table->foreignUuid('term_id')->constrained('terms')->cascadeOnDelete();
            $table->decimal('total_amount', 12, 2);
            $table->decimal('paid_amount', 12, 2)->default(0.00);
            $table->date('due_date');
            $table->enum('status', ['UNPAID', 'PARTIAL', 'PAID'])->default('UNPAID');
            $table->timestamps();
        });

        // 3. Line items for the invoice
        Schema::create('fee_invoice_items', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->foreignUuid('fee_invoice_id')->constrained('fee_invoices')->cascadeOnDelete();
            $table->foreignUuid('fee_category_id')->constrained('fee_categories');
            $table->decimal('amount', 12, 2);
            $table->timestamps();
        });

        // 4. Payment transactions recorded against invoices
        Schema::create('fee_payments', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->string('receipt_number')->unique();
            $table->foreignUuid('fee_invoice_id')->constrained('fee_invoices')->cascadeOnDelete();
            $table->decimal('amount', 12, 2);
            $table->string('payment_method'); // Bank Transfer, Cash, Mobile Money
            $table->string('reference_code')->nullable(); // Bank slip # / M-Pesa ref
            $table->date('payment_date');
            $table->foreignId('received_by')->constrained('users');
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('fee_payments');
        Schema::dropIfExists('fee_invoice_items');
        Schema::dropIfExists('fee_invoices');
        Schema::dropIfExists('fee_categories');
    }
};