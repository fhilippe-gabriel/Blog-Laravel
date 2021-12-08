<?php

use App\Models\Jornada;
use Illuminate\Database\Seeder;

class JornadaSeeder extends Seeder
{
    public function run()
    {
        factory(Jornada::class, 10)->create();
    }
}
