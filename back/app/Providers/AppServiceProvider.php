<?php

namespace App\Providers;

use App\Models\RefreshToken;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\ServiceProvider;

class AppServiceProvider extends ServiceProvider
{
    /**
     * Register any application services.
     */
    public function register(): void
    {
        //
    }

    /**
     * Bootstrap any application services.
     */
    public function boot()
    {
        if (Schema::hasTable('refresh_tokens')) {
            RefreshToken::where('expires_at', '<', now())->delete();
        }
    }
}
