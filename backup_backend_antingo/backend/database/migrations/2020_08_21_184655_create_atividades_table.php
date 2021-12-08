<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateAtividadesTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('atividades', function (Blueprint $table) {
            $table->bigIncrements('id');
            $table->bigInteger('numero')->unique();
            $table->string('descricao');
            $table->date('data_inicio');
            $table->date('data_termino');
            $table->integer('quantidade_dias');
            $table->integer('horas_previstas');
            $table->integer('horas_realizadas');
            
            $table->integer('responsavel_id')->unsigned();
            $table->foreign('responsavel_id')->references('id')->on('funcionarios')->onDelete('cascade');
            
            $table->integer('projeto_id')->unsigned();
            $table->foreign('projeto_id')->references('id')->on('projetos')->onDelete('cascade');

            $table->integer('tarifa_id')->unsigned();
            $table->foreign('tarifa_id')->references('id')->on('tarifas')->onDelete('cascade');
            
            $table->integer('tipo_atividade_id')->unsigned();
            $table->foreign('tipo_atividade_id')->references('id')->on('tipos_atividades')->onDelete('cascade');

            $table->integer('tipo_faturamento_id')->unsigned();
            $table->foreign('tipo_faturamento_id')->references('id')->on('tipos_faturamentos')->onDelete('cascade');

            $table->string('observacao')->nullable();
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
        Schema::dropIfExists('atividades');
    }
}
