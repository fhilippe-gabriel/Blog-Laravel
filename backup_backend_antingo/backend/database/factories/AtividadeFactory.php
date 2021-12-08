<?php

/** @var \Illuminate\Database\Eloquent\Factory $factory */

use App\Models\Funcionario;
use App\Models\Projeto;
use App\Models\Tarifa;
use App\Models\TipoAtividade;
use App\Models\TipoFaturamento;
use App\Models\Atividade;
use Faker\Generator as Faker;

$factory->define(Atividade::class, function (Faker $faker) {
    return [
        'numero' => $faker->numberBetween(159867, 859867),
        'descricao' => $faker->jobTitle,
        'data_inicio' => $faker->dateTimeBetween($startDate = '-5 months', $endDate = 'now'),
        'data_termino' => $faker->dateTimeBetween($startDate = '-5 weeks', $endDate = 'now'),
        'quantidade_dias' => $faker->numberBetween(40, 150),
        'horas_previstas' => 50,
        'horas_realizadas' => $faker->numberBetween(40, 50),
        'responsavel_id' => Funcionario::select('id')->inRandomOrder()->first(),
        'projeto_id' => Projeto::select('id')->inRandomOrder()->first(),
        'tarifa_id' => Tarifa::select('id')->inRandomOrder()->first(),
        'tipo_atividade_id' => TipoAtividade::select('id')->inRandomOrder()->first(),
        'tipo_faturamento_id' => TipoFaturamento::select('id')->inRandomOrder()->first(),
        'observacao' => $faker->text(150),
    ];
});
