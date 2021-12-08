<?php

/** @var \Illuminate\Database\Eloquent\Factory $factory */

use App\Models\Jornada;
use Faker\Generator as Faker;

$factory->define(Jornada::class, function (Faker $faker) {
    return [
        'hora_inicio' => $faker->time('H:i'),
        'hora_fim' => $faker->time('H:i'),
        'percentual' => $faker->numberBetween(0,100),
        'periculosidade' => $faker->numberBetween(0,100),
        'insalubridade' => $faker->numberBetween(0,100),
    ];
});
