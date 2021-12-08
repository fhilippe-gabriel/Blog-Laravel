<?php

use App\Models\Cliente;
use Illuminate\Database\Seeder;

class ClienteSeeder extends Seeder
{
    public function run()
    {
        factory(Cliente::class, 10)->create();
    }
}
