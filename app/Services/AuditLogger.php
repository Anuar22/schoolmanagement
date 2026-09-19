<?php

namespace App\Services;

use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;

class AuditLogger
{
    /**
     * Record an audit trail entry.
     */
    public static function record(
        string $action,
        string $entityType,
        string $entityId,
        ?array $oldValues = null,
        ?array $newValues = null
    ): void {
        $user = auth()->user();
        $tenantId = $user?->tenant_id;

        if (!$tenantId) {
            return;
        }

        DB::table('audit_logs')->insert([
            'id' => (string) Str::uuid(),
            'tenant_id' => $tenantId,
            'user_id' => $user?->id,
            'action' => strtoupper($action),
            'entity_type' => $entityType,
            'entity_id' => (string) $entityId,
            'old_values' => $oldValues ? json_encode($oldValues) : null,
            'new_values' => $newValues ? json_encode($newValues) : null,
            'ip_address' => request()->ip(),
            'user_agent' => substr(request()->userAgent() ?? '', 0, 500),
            'created_at' => now(),
            'updated_at' => now(),
        ]);
    }
}