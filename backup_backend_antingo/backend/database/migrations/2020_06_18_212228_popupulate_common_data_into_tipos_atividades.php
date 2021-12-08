<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Facades\DB;

class PopupulateCommonDataIntoTiposAtividades extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        DB::table('tipos_atividades')->insert(
            [
                [
                    'numero' => 1,
                    'descricao' => 'Administração',
                    'observacao' => 'Administração',
                ],
                [
                    'numero' => 2,
                    'descricao' => 'Empreitada',
                    'observacao' => 'Empreitada',
                ],
                [
                    'numero' => 3,
                    'descricao' => 'Parada',
                    'observacao' => 'Parada',
                ]
            ]
        );
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        return;
    }
}
