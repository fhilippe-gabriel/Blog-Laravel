<?php

use App\Models\FuncionarioExame;
use Illuminate\Database\Seeder;
use \Illuminate\Database\Eloquent\Factory;

class FuncionarioExameSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        factory(FuncionarioExame::class, 20)->create();
    }
}