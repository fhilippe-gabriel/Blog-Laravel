<?php

use App\Models\FuncionarioCertificado;
use Illuminate\Database\Seeder;

class FuncionarioCertificadoSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        factory(FuncionarioCertificado::class, 20)->create();
    }
}
