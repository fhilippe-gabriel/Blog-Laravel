<?php

use App\Models\Exame;
use Illuminate\Database\Seeder;

class ExameSeeder extends Seeder
{
    public function run()
    {
        factory(Exame::class, 20)->create();
    }
}
