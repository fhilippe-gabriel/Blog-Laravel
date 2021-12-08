<?php

use App\Models\TipoAtividade;
use Faker\Generator as Faker;

$factory->define(TipoAtividade::class, function (Faker $faker) {
    return [
        'numero' => $faker->numberBetween(159867, 859867),
        'descricao' => $faker->jobTitle,
        'observacao' => $faker->text(150),
    ];
});
