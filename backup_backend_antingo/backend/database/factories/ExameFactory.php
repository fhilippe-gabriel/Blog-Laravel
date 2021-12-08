<?php

use App\Models\Exame;
use Faker\Generator as Faker;

$factory->define(Exame::class, function (Faker $faker) {

    $company = $faker->company;
    $tipoExame = ['admissao', 'atestado', 'demissao'];

    return [
        'nome_exame'        => $company,
        'tipo_exame'        => $tipoExame[rand(0, 2)],
        'observacao'        => $faker->text(50),
        'validade_meses'    => rand(1, 99),
    ];
});
