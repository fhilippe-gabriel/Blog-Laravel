<?php

/** @var \Illuminate\Database\Eloquent\Factory $factory */

use App\Models\TipoFaturamento;
use Faker\Generator as Faker;

$factory->define(TipoFaturamento::class, function (Faker $faker) {
    return [
        'descricao' => $faker->jobTitle,
        'observacao' => $faker->text(150),
    ];
});
