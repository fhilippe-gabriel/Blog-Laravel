<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class AlterTableAtividades extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::table('atividades', function (Blueprint $table) {
            $table->string('numero')->change();
            $table->decimal('quantidade_dias', 12, 2)->change();
            $table->decimal('horas_previstas', 12, 2)->change();
            $table->decimal('horas_realizadas', 12, 2)->change();
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        //
    }
}
