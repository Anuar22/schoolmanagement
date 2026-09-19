<?php

namespace App\Http\Controllers\Academic;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;

class AuditLogController extends Controller
{
    //
}
<?php

namespace App\Http\Controllers\Academic;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;

class AuditLogController extends Controller
{
    public function index(Request $request)
    {
        $tenantId = $request->user()->tenant_id;

        $logs = DB::table('audit_logs')
            ->leftJoin('users', 'audit_logs.user_id', '=', 'users.id')
            ->where('audit_logs.tenant_id', $tenantId)
            ->select(
                'audit_logs.id',
                'audit_logs.action',
                'audit_logs.entity_type',
                'audit_logs.entity_id',
                'audit_logs.old_values',
                'audit_logs.new_values',
                'audit_logs.ip_address',
                'audit_logs.created_at',
                'users.name as user_name',
                'users.email as user_email'
            )
            ->orderByDesc('audit_logs.created_at')
            ->paginate(25);

        return Inertia::render('Academic/AuditLogs', [
            'logs' => $logs,
        ]);
    }
}