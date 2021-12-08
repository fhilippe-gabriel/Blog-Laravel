<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateFuncionariosTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('funcionarios', function (Blueprint $table) {
            $table->increments('id');
            $table->integer('cargo_id');
            $table->string('nome');
            $table->date('data_admissao');
            $table->date('data_demissao')->nullable();
            $table->float('salario', 12, 2);
            $table->string('dia_pagamento',2);
            $table->string('rg')->nullable();
            $table->string('cpf')->unique();
            $table->string('ctps')->nullable();
            $table->string('telefone_fixo')->nullable();
            $table->string('celular')->nullable();
            $table->string('pis')->nullable();
            $table->enum('status', ['ativo', 'inativo']);
            $table->foreign('cargo_id')->references('id')->on('cargos')->onDelete('cascade');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('funcionarios');
    }
}
