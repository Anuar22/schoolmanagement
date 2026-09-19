<?php

namespace App\Services;

use stdClass;
use Illuminate\Support\Facades\DB;

class TenantManager
{
    protected ?object $tenant = null;

    public function setTenant(object $tenant): void
    {
        $this->tenant = $tenant;
    }

    public function getTenant(): ?object
    {
        return $this->tenant;
    }

    public function getTenantId(): ?string
    {
        return $this->tenant?->id;
    }

    public function check(): bool
    {
        return !is_null($this->tenant);
    }
}