<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('students', function (Blueprint $table) {
            // Drop global unique index if it existed previously
            // $table->dropUnique(['admission_number']);

            // Composite unique index ensures scope per institution
            $table->unique(['tenant_id', 'admission_number'], 'students_tenant_admission_unique');
        });

        Schema::table('attendance', function (Blueprint $table) {
            // Prevent duplicate records for the same student on the same date
            $table->unique(['tenant_id', 'student_id', 'date'], 'attendance_tenant_student_date_unique');
        });
    }

    public function down(): void
    {
        Schema::table('students', function (Blueprint $table) {
            $table->dropUnique('students_tenant_admission_unique');
        });

        Schema::table('attendance', function (Blueprint $table) {
            $table->dropUnique('attendance_tenant_student_date_unique');
        });
    }
};