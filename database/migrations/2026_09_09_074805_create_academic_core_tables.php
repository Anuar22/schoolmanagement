<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        // 1. Academic Terms
        Schema::create('terms', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->string('name'); // e.g., "Term 1 - 2026"
            $table->date('start_date');
            $table->date('end_date');
            $table->boolean('is_active')->default(false);
            $table->timestamps();
        });

        // 2. Classes & Streams
        Schema::create('classes', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->string('name'); // e.g., "Form 1", "Grade 7"
            $table->string('stream')->nullable(); // e.g., "Stream A", "Gold"
            $table->integer('level'); // 1, 2, 3 for ordering
            $table->timestamps();
        });

        // 3. Subjects
        Schema::create('subjects', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->string('name');
            $table->string('code')->unique(); // e.g., "MATH", "ENG"
            $table->string('department');     // e.g., "Sciences", "Arts"
            $table->timestamps();
        });

        // 4. Students
        Schema::create('students', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->string('admission_number')->unique();
            $table->string('first_name');
            $table->string('last_name');
            $table->enum('gender', ['Male', 'Female']);
            $table->foreignUuid('class_id')->constrained('classes')->cascadeOnDelete();
            $table->boolean('is_active')->default(true);
            $table->timestamps();
        });

        // 5. Assessment Types (e.g. Midterm 30%, Terminal 70%)
        Schema::create('assessment_types', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->string('name'); 
            $table->decimal('weight', 5, 2); // e.g., 30.00
            $table->decimal('max_score', 5, 2)->default(100.00);
            $table->timestamps();
        });

        // 6. Assessments (Instances of tests created for a class/subject)
        Schema::create('assessments', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->foreignUuid('term_id')->constrained('terms')->cascadeOnDelete();
            $table->foreignUuid('class_id')->constrained('classes')->cascadeOnDelete();
            $table->foreignUuid('subject_id')->constrained('subjects')->cascadeOnDelete();
            $table->foreignUuid('assessment_type_id')->constrained('assessment_types')->cascadeOnDelete();
            $table->date('date_administered')->useCurrent();
            $table->timestamps();
            $table->unique(['term_id', 'class_id', 'subject_id', 'assessment_type_id'], 'unique_class_subject_assessment');
        });

        // 7. Student Grades (The cell values replacing Excel)
        Schema::create('grades', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->foreignUuid('assessment_id')->constrained('assessments')->cascadeOnDelete();
            $table->foreignUuid('student_id')->constrained('students')->cascadeOnDelete();
            $table->decimal('score', 5, 2);
            $table->text('remarks')->nullable();
            $table->foreignId('entered_by')->constrained('users');
            $table->timestamps();
            $table->unique(['assessment_id', 'student_id']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('grades');
        Schema::dropIfExists('assessments');
        Schema::dropIfExists('assessment_types');
        Schema::dropIfExists('students');
        Schema::dropIfExists('subjects');
        Schema::dropIfExists('classes');
        Schema::dropIfExists('terms');
    }
};