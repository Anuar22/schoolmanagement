<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;
use App\Models\User;

class AcademicSeeder extends Seeder
{
    public function run(): void
    {
        // 1. Create a default teacher/admin user if none exists
        $user = User::firstOrCreate(
            ['email' => 'teacher@school.ac.tz'],
            [
                'name' => 'Demo Teacher',
                'password' => bcrypt('password123'),
            ]
        );

        // 2. Active Term
        $termId = (string) Str::uuid();
        DB::table('terms')->insert([
            'id' => $termId,
            'name' => 'Term 2 - 2026',
            'start_date' => '2026-05-01',
            'end_date' => '2026-08-31',
            'is_active' => true,
            'created_at' => now(),
            'updated_at' => now(),
        ]);

        // 3. Classes
        $classes = [
            ['id' => (string) Str::uuid(), 'name' => 'Form 1', 'stream' => 'Stream A', 'level' => 1],
            ['id' => (string) Str::uuid(), 'name' => 'Form 1', 'stream' => 'Stream B', 'level' => 1],
            ['id' => (string) Str::uuid(), 'name' => 'Form 2', 'stream' => 'Stream A', 'level' => 2],
        ];
        DB::table('classes')->insert(array_map(fn($c) => array_merge($c, ['created_at' => now(), 'updated_at' => now()]), $classes));

        $targetClassId = $classes[0]['id']; // Form 1 Stream A

        // 4. Subjects
        $subjects = [
            ['id' => (string) Str::uuid(), 'name' => 'Mathematics', 'code' => 'MATH', 'department' => 'Sciences'],
            ['id' => (string) Str::uuid(), 'name' => 'English Language', 'code' => 'ENG', 'department' => 'Languages'],
            ['id' => (string) Str::uuid(), 'name' => 'Physics', 'code' => 'PHY', 'department' => 'Sciences'],
            ['id' => (string) Str::uuid(), 'name' => 'History', 'code' => 'HIST', 'department' => 'Humanities'],
        ];
        DB::table('subjects')->insert(array_map(fn($s) => array_merge($s, ['created_at' => now(), 'updated_at' => now()]), $subjects));

        $targetSubjectId = $subjects[0]['id']; // Mathematics

        // 5. Assessment Types
        $midtermId = (string) Str::uuid();
        $terminalId = (string) Str::uuid();
        DB::table('assessment_types')->insert([
            ['id' => $midtermId, 'name' => 'Midterm Test', 'weight' => 30.00, 'max_score' => 100.00, 'created_at' => now(), 'updated_at' => now()],
            ['id' => $terminalId, 'name' => 'Terminal Exam', 'weight' => 70.00, 'max_score' => 100.00, 'created_at' => now(), 'updated_at' => now()],
        ]);

        // 6. Students for Form 1 Stream A
        $students = [
            ['id' => (string) Str::uuid(), 'admission_number' => 'ADM2026001', 'first_name' => 'Juma', 'last_name' => 'Bakari', 'gender' => 'Male', 'class_id' => $targetClassId],
            ['id' => (string) Str::uuid(), 'admission_number' => 'ADM2026002', 'first_name' => 'Neema', 'last_name' => 'Massawe', 'gender' => 'Female', 'class_id' => $targetClassId],
            ['id' => (string) Str::uuid(), 'admission_number' => 'ADM2026003', 'first_name' => 'Amina', 'last_name' => 'Salim', 'gender' => 'Female', 'class_id' => $targetClassId],
            ['id' => (string) Str::uuid(), 'admission_number' => 'ADM2026004', 'first_name' => 'Daniel', 'last_name' => 'Moller', 'gender' => 'Male', 'class_id' => $targetClassId],
            ['id' => (string) Str::uuid(), 'admission_number' => 'ADM2026005', 'first_name' => 'Kelvin', 'last_name' => 'Shirima', 'gender' => 'Male', 'class_id' => $targetClassId],
        ];
        DB::table('students')->insert(array_map(fn($st) => array_merge($st, ['is_active' => true, 'created_at' => now(), 'updated_at' => now()]), $students));

        // 7. Initialize a Midterm Assessment record for Form 1 Stream A - Mathematics
        $assessmentId = (string) Str::uuid();
        DB::table('assessments')->insert([
            'id' => $assessmentId,
            'term_id' => $termId,
            'class_id' => $targetClassId,
            'subject_id' => $targetSubjectId,
            'assessment_type_id' => $midtermId,
            'date_administered' => now()->toDateString(),
            'created_at' => now(),
            'updated_at' => now(),
        ]);
    }
}