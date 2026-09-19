<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('tenants', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->string('name'); // e.g., "St. Jude Academy"
            $table->string('subdomain')->unique(); // e.g., "stjudes"
            $table->string('domain')->nullable()->unique(); // Custom domains e.g., "portal.stjudes.ac.tz"
            $table->string('contact_email')->nullable();
            $table->string('contact_phone')->nullable();
            $table->string('currency', 10)->default('TZS');
            $table->string('plan')->default('starter'); // starter, pro, enterprise
            $table->boolean('is_active')->default(true);
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('tenants');
    }
};