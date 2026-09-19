<?php

namespace App\Policies;

use App\Models\User;

class FeePolicy
{
    /**
     * Determine whether the user can view the fee ledger.
     */
    public function view(User $user): bool
    {
        return $user->isAdmin() || $user->isBursar();
    }

    /**
     * Determine whether the user can record fee payments.
     */
    public function recordPayment(User $user): bool
    {
        return $user->isAdmin() || $user->isBursar();
    }
}