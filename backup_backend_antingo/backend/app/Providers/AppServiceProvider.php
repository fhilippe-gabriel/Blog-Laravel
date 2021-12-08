<?php

namespace App\Providers;

use Illuminate\Support\ServiceProvider;

use Faker\Generator as FakerGenerator;
use Faker\Factory as FakerFactory;

use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Facades\URL;

class AppServiceProvider extends ServiceProvider
{
    /**
     * Register any application services.
     *
     * @return void
     */
    public function register()
    {
        $this->app->singleton(FakerGenerator::class, function () {
            return FakerFactory::create('pt_BR');
        });
    }

    /**
     * Bootstrap any application services.
     *
     * @return void
     */
    public function boot()
    {
        if (env('ENABLE_HTTPS')) {
            URL::forceScheme('https');
        }
        Schema::defaultStringLength(191);
    }
}
