<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class CheckUserRole
{
    /**
     * Handle an incoming request.
     */
    public function handle(Request $request, Closure $next, string ...$roles): Response
    {
        $user = $request->user();

        if (!$user) {
            return redirect()->route('login');
        }

        $userRole = strtolower(trim($user->role ?? 'teacher'));
        
        // Flatten and lowercase requested roles (handles both 'role:admin' and 'role:admin,teacher')
        $allowedRoles = [];
        foreach ($roles as $roleGroup) {
            foreach (explode(',', $roleGroup) as $r) {
                $allowedRoles[] = strtolower(trim($r));
            }
        }

        // Super admins can pass any role gate
        if ($userRole === 'super_admin') {
            return $next($request);
        }

        // Check if the user's role is in the allowed list
        if (in_array($userRole, $allowedRoles, true)) {
            return $next($request);
        }

        // If a Teacher tries to access an Admin route, bounce them to the Teacher dashboard
        if ($userRole === 'teacher') {
            return redirect()->route('teacher.dashboard');
        }

        // If a Bursar tries to access non-fee areas, bounce them to the fees ledger
        if ($userRole === 'bursar') {
            return redirect()->route('fees.index');
        }

        abort(403, "Access Denied: Your assigned role ({$userRole}) cannot view this institutional workspace.");
    }
}