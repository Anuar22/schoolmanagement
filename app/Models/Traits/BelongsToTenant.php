<?php

namespace App\Models\Traits;

use App\Services\TenantManager;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Model;

trait BelongsToTenant
{
    protected static function bootBelongsToTenant(): void
    {
        $tenantManager = app(TenantManager::class);

        // 1. Global Select Scope
        static::addGlobalScope('tenant', function (Builder $builder) use ($tenantManager) {
            if ($tenantManager->check()) {
                $builder->where($builder->getModel()->getTable() . '.tenant_id', $tenantManager->getTenantId());
            }
        });

        // 2. Automatic Tenant ID injection on Insert
        static::creating(function (Model $model) use ($tenantManager) {
            if ($tenantManager->check() && empty($model->tenant_id)) {
                $model->tenant_id = $tenantManager->getTenantId();
            }
        });
    }
}