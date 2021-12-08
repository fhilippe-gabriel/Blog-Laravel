<?php

use App\Models\TipoAtividade;
use Illuminate\Database\Seeder;

class TipoAtividadeSeeder extends Seeder
{
    public function run()
    {
        factory(TipoAtividade::class, 5)->create();
    }
}
