<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;

class DatabaseSeeder extends Seeder
{
    public function run(): void
    {
        // 1. Ensure Tenant Exists
        $tenantId = DB::table('tenants')->value('id');
        if (!$tenantId) {
            $tenantId = (string) Str::uuid();
            DB::table('tenants')->insert([
                'id' => $tenantId,
                'name' => 'EduCore Demo Academy',
                'created_at' => now(),
                'updated_at' => now(),
            ]);
        }

        // 2. Headmaster / School Administrator Account
        User::updateOrCreate(
            ['email' => 'admin@educore.test'],
            [
                'name' => 'Dr. Arnold (Headmaster)',
                'password' => Hash::make('password'),
                'role' => 'admin',
                'tenant_id' => $tenantId,
                'email_verified_at' => now(),
            ]
        );

        // 3. Lead Subject Teacher Account
        User::updateOrCreate(
            ['email' => 'teacher@educore.test'],
            [
                'name' => 'Mr. Aimable (Faculty Lead)',
                'password' => Hash::make('password'),
                'role' => 'teacher',
                'tenant_id' => $tenantId,
                'email_verified_at' => now(),
            ]
        );

        // 4. Bursar / Finance Account
        User::updateOrCreate(
            ['email' => 'bursar@educore.test'],
            [
                'name' => 'Noel (Bursar)',
                'password' => Hash::make('password'),
                'role' => 'bursar',
                'tenant_id' => $tenantId,
                'email_verified_at' => now(),
            ]
        );
    }
}