<?php

use App\Models\Funcionario;
use Illuminate\Database\Seeder;

class FuncionarioSeeder extends Seeder
{
    public function run()
    {
        factory(Funcionario::class, 100)->create();
    }
}
