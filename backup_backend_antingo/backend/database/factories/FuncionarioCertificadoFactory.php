<?php

/** @var \Illuminate\Database\Eloquent\Factory $factory */

use App\Models\FuncionarioCertificado;
use Faker\Generator as Faker;
use Illuminate\Database\Eloquent\Factory;

$factory->define(FuncionarioCertificado::class, function (Faker $faker) {

    $company = $faker->company;

    return [
        'funcionario_id'  => rand(1, 10),
        'certificado_id'  => rand(1, 10),
        'data_realizacao' => $faker->dateTime,
    ];
});