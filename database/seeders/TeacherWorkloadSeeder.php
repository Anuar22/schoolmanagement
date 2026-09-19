<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;

class TeacherWorkloadSeeder extends Seeder
{
    public function run(): void
    {
        $teacher = DB::table('users')->where('email', 'teacher@educore.test')->first();
        $tenant = DB::table('tenants')->first();

        if (!$teacher || !$tenant) return;

        // Grab one class and one subject
        $firstClass = DB::table('classes')->where('tenant_id', $tenant->id)->first();
        $firstSubject = DB::table('subjects')->where('tenant_id', $tenant->id)->first();

        if ($firstClass && $firstSubject) {
            DB::table('teacher_allocations')->updateOrInsert(
                [
                    'tenant_id' => $tenant->id,
                    'teacher_id' => $teacher->id,
                    'class_id' => $firstClass->id,
                    'subject_id' => $firstSubject->id,
                ],
                [
                    'id' => (string) Str::uuid(),
                    'created_at' => now(),
                    'updated_at' => now(),
                ]
            );
        }
    }
}