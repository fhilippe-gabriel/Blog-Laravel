<?php
use App\Models\Cliente;
use Faker\Generator as Faker;

$factory->define(Cliente::class, function (Faker $faker) {
    $empresa = $faker->company;
    return [
        'razao_social' => "{$empresa} {$faker->companySuffix}",
        'nome_fantasia' => $empresa,
        'cnpj' => $faker->cnpj(false),
        'contato_nome' => $faker->name,
        'contato_cargo' => $faker->jobTitle,
        'contato_fone'=> $faker->phoneNumberCleared
    ];
});
