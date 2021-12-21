<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateResponsaveisTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('responsaveis', function (Blueprint $table) {
            $table->id();
            $table->string('nomeResponsavel')->nullable();
            $table->string('nascimentoResponsavel')->nullable();
            $table->string('RGresponsavel')->nullable();
            $table->string('CPFresponsavel')->nullable();
            $table->string('enderecoResponsavel')->nullable();
            $table->string('CEPresponsavel')->nullable();
            $table->string('celularResponsavel')->nullable();
            $table->string('telefonecasaResponavel')->nullable();
            $table->string('telefonecomercialResponavel')->nullable();
            $table->string('emailResponsavel')->nullable();
            $table->bigInteger('user_id');
            $table->foreign('user_id')->references('id')->on('users')->onDelete('cascade');
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
        Schema::dropIfExists('responsaveis');
    }
}