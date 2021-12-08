<?php

use App\Models\Projeto;
use Illuminate\Database\Seeder;

class ProjetoSeeder extends Seeder
{
    public function run()
    {
        factory(Projeto::class, 10)->create();
    }
}
