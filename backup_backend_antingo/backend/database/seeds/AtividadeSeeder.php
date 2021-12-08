<?php

use Illuminate\Database\Seeder;
use App\Models\Atividade;

class AtividadeSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        factory(Atividade::class, 5)->create();
    }
}
