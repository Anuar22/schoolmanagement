<?php

namespace App\Http\Middleware;

use App\Services\TenantManager;
use Closure;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Symfony\Component\HttpFoundation\Response;

class ResolveTenant
{
    public function __construct(protected TenantManager $tenantManager) {}

    public function handle(Request $request, Closure $next): Response
    {
        // 1. Skip rigid checks on public authentication lifecycle routes
        if ($request->is('logout', 'login', 'register', 'password/*', '/')) {
            $tenant = DB::table('tenants')->where('is_active', true)->first();
            if ($tenant) {
                $this->tenantManager->setTenant($tenant);
            }
            return $next($request);
        }

        $tenant = null;

        // 2. Resolve via authenticated user
        if ($request->user() && $request->user()->tenant_id) {
            $tenant = DB::table('tenants')->where('id', $request->user()->tenant_id)->first();
        }

        // 3. Resolve via Subdomain (e.g., demo.educore.test)
        if (!$tenant) {
            $host = $request->getHost();
            $parts = explode('.', $host);

            if (count($parts) >= 3) {
                $subdomain = $parts[0];
                $tenant = DB::table('tenants')
                    ->where('subdomain', $subdomain)
                    ->where('is_active', true)
                    ->first();
            }
        }

        // 4. Local Development Fallback
        if (!$tenant && app()->environment('local')) {
            $tenant = DB::table('tenants')->where('is_active', true)->first();
        }

        if (!$tenant) {
            abort(403, 'Institutional Tenant Not Found or Inactive.');
        }

        $this->tenantManager->setTenant($tenant);

        return $next($request);
    }
}