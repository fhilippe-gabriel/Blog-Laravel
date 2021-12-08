<?php

use App\Models\Projeto;
use Faker\Generator as Faker;

$factory->define(Projeto::class, function (Faker $faker) {
    return [
        'descricao' => $faker->jobTitle,
        'valor' => $faker->randomFloat(),
        'data_inicio' => $faker->dateTime,
        'data_fim' => $faker->dateTime,
        'local' => $faker->address,
        'cliente_id' => rand(1, 10)
    ];
});
