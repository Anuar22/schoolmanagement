<?php

namespace App\Policies;

use App\Models\User;
use Illuminate\Support\Facades\DB;

class GradePolicy
{
    /**
     * Determine whether the user can enter or update grades.
     */
    public function update(User $user, string $classId, string $subjectId): bool
    {
        // Admins can edit any grade
        if ($user->isAdmin()) {
            return true;
        }

        // Bursars cannot edit grades under any circumstances
        if ($user->isBursar()) {
            return false;
        }

        // Teachers can only edit if assigned in teacher_allocations
        return DB::table('teacher_allocations')
            ->where('tenant_id', $user->tenant_id)
            ->where('teacher_id', $user->id)
            ->where('class_id', $classId)
            ->where('subject_id', $subjectId)
            ->exists();
    }
}