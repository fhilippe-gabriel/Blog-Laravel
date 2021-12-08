<?php

use App\Models\Tarifa;
use Faker\Generator as Faker;

$factory->define(Tarifa::class, function (Faker $faker) {
    return [
        'descricao'         => $faker->text(30),
    ];
});
