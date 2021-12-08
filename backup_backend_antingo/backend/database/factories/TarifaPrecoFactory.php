<?php

/** @var \Illuminate\Database\Eloquent\Factory $factory */

use App\Models\TipoRecurso;
use App\Models\Tarifa;
use App\Models\TarifaPreco;
use Faker\Generator as Faker;

$factory->define(TarifaPreco::class, function (Faker $faker) {
    return [
        'valor' => $faker->randomFloat(2, 5.00, 180.00),
        'tarifa_id' => Tarifa::select('id')->inRandomOrder()->first(),
        'tipo_recurso_id' => TipoRecurso::select('id')->inRandomOrder()->first(),
        'observacao' => $faker->text(150),
    ];
});
