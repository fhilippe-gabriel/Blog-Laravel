<?php

use App\Models\Tarifa;
use Illuminate\Database\Seeder;

class TarifaSeeder extends Seeder
{
    public function run()
    {
        factory(Tarifa::class, 5)->create();
    }
}
