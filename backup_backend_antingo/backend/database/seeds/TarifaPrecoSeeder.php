<?php

use Illuminate\Database\Seeder;
use App\Models\TarifaPreco;
    
class TarifaPrecoSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        factory(TarifaPreco::class, 20)->create();
    }
}
