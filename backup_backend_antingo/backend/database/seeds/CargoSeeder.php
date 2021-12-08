<?php

use Illuminate\Database\Seeder;
use App\Models\Cargo;

class CargoSeeder extends Seeder
{
    public function run()
    {
        factory(Cargo::class, 20)->create();
    }
}
