<?php

/** @var \Illuminate\Database\Eloquent\Factory $factory */

use App\Models\FuncionarioExame;
use Faker\Generator as Faker;
use Illuminate\Database\Eloquent\Factory;

$factory->define(FuncionarioExame::class, function (Faker $faker) {

    return [
        'funcionario_id'  => rand(1, 10),
        'exame_id'        => rand(1, 10),
        'data_realizacao' => $faker->dateTime,
    ];
});