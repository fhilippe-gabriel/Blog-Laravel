<?php

use App\Models\Funcionario;
use Faker\Generator as Faker;

$factory->define(Funcionario::class, function (Faker $faker) {
    return [
        'nome'              => $faker->name,
        'data_admissao'     => $faker->dateTime,
        'data_demissao'     => $faker->randomElement(array ($faker->dateTime,null)),
        'salario'           => $faker->randomFloat($nbMaxDecimals = 2, $min = 1245.45, $max = 5345.45),
        'dia_pagamento'     => $faker->dayOfMonth($max = 'now'),
        'rg'                => $faker->rg(false),
        'cpf'               => $faker->cpf(false),
        'ctps'              => $faker->cpf(false),
        'telefone_fixo'     => $faker->phoneNumberCleared,
        'celular'           => $faker->phoneNumberCleared,
        'pis'               => $faker->cpf(false),
        'status'            => $faker->randomElement(array ('ativo','inativo')),
        'cargo_id'          => rand(1, 10),
    ];
});
