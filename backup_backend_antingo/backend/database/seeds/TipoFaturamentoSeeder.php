<?php

use Illuminate\Database\Seeder;
use App\Models\TipoFaturamento;

class TipoFaturamentoSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        factory(TipoFaturamento::class, 5)->create();
    }
}
