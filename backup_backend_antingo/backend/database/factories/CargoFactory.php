<?php

use App\Models\Cargo;
use Faker\Generator as Faker;

$factory->define(Cargo::class, function (Faker $faker) {
    return [
        'cargo'             => $faker->jobTitle,
        'descricao'         => $faker->text(70),
        'detalhes'          => $faker->text(150),
    ];
});
