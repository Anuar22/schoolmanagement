<?php

namespace App\Http\Controllers;

use App\Http\Requests\ProfileUpdateRequest;
use Illuminate\Contracts\Auth\MustVerifyEmail;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Redirect;
use Inertia\Inertia;
use Inertia\Response;

class ProfileController extends Controller
{
    /**
     * Display the user's institutional profile.
     */
    public function edit(Request $request): Response
    {
        $user = $request->user();
        $tenantId = $user->tenant_id;

        // Fetch tenant school info safely
        $tenant = $tenantId
            ? DB::table('tenants')->where('id', $tenantId)->first()
            : null;

        // If teacher, fetch their assigned courses
        $allocations = [];
        if (strtolower($user->role ?? '') === 'teacher' && $tenantId) {
            $allocations = DB::table('teacher_allocations')
                ->where('teacher_allocations.tenant_id', $tenantId)
                ->where('teacher_allocations.teacher_id', $user->id)
                ->join('classes', 'teacher_allocations.class_id', '=', 'classes.id')
                ->join('subjects', 'teacher_allocations.subject_id', '=', 'subjects.id')
                ->select(
                    'classes.name as class_name',
                    'classes.stream',
                    'subjects.name as subject_name',
                    'subjects.code as subject_code'
                )
                ->get();
        }

        return Inertia::render('Profile/Edit', [
            'mustVerifyEmail' => $user instanceof MustVerifyEmail,
            'status' => session('status'),
            'institution' => [
                'name' => $tenant->name ?? 'EduCore Institutional Academy',
                'tenant_id' => $tenantId,
                'role' => strtoupper($user->role ?? 'TEACHER'),
                'allocations' => $allocations,
            ],
            // Explicit auth payload guarantees the badge and props match
            'auth' => [
                'user' => [
                    'id' => $user->id,
                    'name' => $user->name,
                    'email' => $user->email,
                    'role' => strtolower($user->role ?? 'teacher'),
                    'tenant_id' => $tenantId,
                ],
            ],
        ]);
    }

    /**
     * Update the user's basic profile details.
     */
    public function update(ProfileUpdateRequest $request): RedirectResponse
    {
        $user = $request->user();
        
        // Only update verified columns (name and email)
        $user->fill($request->validated());

        if ($user->isDirty('email')) {
            $user->email_verified_at = null;
        }

        $user->save();

        return Redirect::route('profile.edit')->with('status', 'profile-updated');
    }

    /**
     * Delete the user's account.
     */
    public function destroy(Request $request): RedirectResponse
    {
        $request->validate([
            'password' => ['required', 'current_password'],
        ]);

        $user = $request->user();

        Auth::logout();

        $user->delete();

        $request->session()->invalidate();
        $request->session()->regenerateToken();

        return Redirect::to('/');
    }
}