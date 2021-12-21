<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateSaudesTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('saudes', function (Blueprint $table) {
            $table->id();
            $table->string('hospital')->nullable();
            $table->string('planoSaude')->nullable();
            $table->string('problemaSaude')->nullable();
            $table->string('alergia')->nullable();
            $table->string('PNE')->nullable();
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
        Schema::dropIfExists('saudes');
    }
}