<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;

class RoleAccountSeeder extends Seeder
{
    public function run(): void
    {
        $tenant = DB::table('tenants')->first();
        if (!$tenant) return;

        // 1. Admin Account
        DB::table('users')->updateOrInsert(
            ['email' => 'admin@educore.test'],
            [
                'tenant_id' => $tenant->id,
                'name' => 'Principal Mntangi',
                'role' => 'admin',
                'password' => Hash::make('password123'),
                'created_at' => now(),
                'updated_at' => now(),
            ]
        );

        // 2. Bursar Account
        DB::table('users')->updateOrInsert(
            ['email' => 'bursar@educore.test'],
            [
                'tenant_id' => $tenant->id,
                'name' => 'Bursar John',
                'role' => 'bursar',
                'password' => Hash::make('password123'),
                'created_at' => now(),
                'updated_at' => now(),
            ]
        );

        // 3. Teacher Account
        DB::table('users')->updateOrInsert(
            ['email' => 'teacher@educore.test'],
            [
                'tenant_id' => $tenant->id,
                'name' => 'Demo Teacher',
                'role' => 'teacher',
                'password' => Hash::make('password123'),
                'created_at' => now(),
                'updated_at' => now(),
            ]
        );

        // Ensure existing first user is marked admin
        DB::table('users')->where('id', 1)->update(['role' => 'admin', 'tenant_id' => $tenant->id]);
    }
}