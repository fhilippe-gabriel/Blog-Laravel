<?php

use App\Models\Certificado;
use Illuminate\Database\Seeder;

class CertificadoSeeder extends Seeder
{
    public function run()
    {
        factory(Certificado::class, 20)->create();
    }
}
