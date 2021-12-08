<?php

/** @var \Illuminate\Database\Eloquent\Factory $factory */

use App\Models\Equipamento;
use App\Models\TipoRecurso;
use Faker\Generator as Faker;

$factory->define(Equipamento::class, function (Faker $faker) {
    return [
        'nome_recurso' => $faker->jobTitle,
        'tipo_recurso_id' => TipoRecurso::select('id')->inRandomOrder()->first(),
        'observacao' => $faker->text(150),
    ];
});
