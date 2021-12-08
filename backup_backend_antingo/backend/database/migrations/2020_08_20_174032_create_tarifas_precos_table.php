<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateTarifasPrecosTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        
        Schema::create('tarifas_precos', function (Blueprint $table) {
            $table->bigIncrements('id');
            $table->bigInteger('numero')->unique();
            $table->decimal('valor', 9, 2);

            $table->integer('tarifa_id')->unsigned();
            $table->foreign('tarifa_id')->references('id')->on('tarifas')->onDelete('cascade');
            
            $table->integer('tipo_recurso_id')->unsigned();
            $table->foreign('tipo_recurso_id')->references('id')->on('tipos_recursos')->onDelete('cascade');

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
        Schema::dropIfExists('tarifas_precos');
    }
}
