<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    protected array $tables = [
        'users',
        'terms',
        'classes',
        'subjects',
        'students',
        'assessments',
        'assessment_types',
        'grades',
        'attendance',
        'fee_categories',
        'fee_invoices',
        'fee_payments',
        'teacher_allocations',
    ];

    public function up(): void
    {
        foreach ($this->tables as $tableName) {
            if (Schema::hasTable($tableName)) {
                Schema::table($tableName, function (Blueprint $table) use ($tableName) {
                    $table->foreignUuid('tenant_id')
                        ->nullable()
                        ->after('id')
                        ->constrained('tenants')
                        ->cascadeOnDelete();

                    $table->index('tenant_id');
                });
            }
        }
    }

    public function down(): void
    {
        foreach ($this->tables as $tableName) {
            if (Schema::hasTable($tableName)) {
                Schema::table($tableName, function (Blueprint $table) {
                    $table->dropForeign(['tenant_id']);
                    $table->dropColumn('tenant_id');
                });
            }
        }
    }
};