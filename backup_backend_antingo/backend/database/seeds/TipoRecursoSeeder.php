<?php

use App\Models\TipoRecurso;
use Illuminate\Database\Seeder;

class TipoRecursoSeeder extends Seeder
{
    public function run()
    {
        factory(TipoRecurso::class, 5)->create();
    }
}
