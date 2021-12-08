<?php

use App\Models\Equipamento;
use Illuminate\Database\Seeder;

class EquipamentoSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        factory(Equipamento::class, 30)->create();
    }
}
