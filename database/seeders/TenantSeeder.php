<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;

class TenantSeeder extends Seeder
{
    public function run(): void
    {
        // 1. Create a Primary School Tenant
        $tenantId = (string) Str::uuid();
        
        DB::table('tenants')->updateOrInsert(
            ['subdomain' => 'demo'],
            [
                'id' => $tenantId,
                'name' => 'Demo Excellence Academy',
                'subdomain' => 'demo',
                'contact_email' => 'admin@demoacademy.ac.tz',
                'currency' => 'TZS',
                'plan' => 'pro',
                'is_active' => true,
                'created_at' => now(),
                'updated_at' => now(),
            ]
        );

        // Fetch ID if it already existed
        $tenant = DB::table('tenants')->where('subdomain', 'demo')->first();
        $targetId = $tenant->id;

        // 2. Link all existing orphan seed data to this tenant
        $tables = [
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

        foreach ($tables as $table) {
            DB::table($table)->whereNull('tenant_id')->update(['tenant_id' => $targetId]);
        }
    }
}