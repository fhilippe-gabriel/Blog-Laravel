<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateTableMapeamentoArquivoPonto extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('mapeamento_arquivo_ponto', function (Blueprint $table) {
            $table->id();
            $table->string('coluna_arquivo');
            $table->string('coluna_banco_dados');
            $table->integer('cliente_id')->unsigned()->nullable();
            $table->timestamps();

            $table->foreign('cliente_id')->references('id')->on('clientes')->onDelete('cascade');
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('mapeamento_arquivo_ponto');
    }
}
