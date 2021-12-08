<?php

use App\Models\Certificado;
use Faker\Generator as Faker;

$factory->define(Certificado::class, function (Faker $faker) {
    return [
        'nome_certificado'  => $faker->company,
        'validade_meses'    => rand(0, 99), 
        'situacao'          => $faker->randomElement($array = array_keys(Certificado::SITUACOES)),
    ];
});
