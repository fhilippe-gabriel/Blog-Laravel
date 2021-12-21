<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateMatriculasTable extends Migration
{

    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('matriculas', function (Blueprint $table) {
            $table->id();
            $table->string('anexoCertidãoNasicmento')->nullable();
            $table->string('anexoRgAluno')->nullable();
            $table->string('anexoTransferenciaAluno')->nullable();
            $table->string('anexoHistoricoEscolar')->nullable();
            $table->string('anexoComprovantePagamento')->nullable();
            $table->string('anexoRgResponsavelContrato')->nullable();
            $table->string('anexoCpfResponsavelContrato')->nullable();
            $table->string('anexoComprovanteresidencial')->nullable();
            $table->string('anexoVacina')->nullable();
            $table->string('perfilAluno')->nullable();
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
        Schema::dropIfExists('matriculas');
    }
}