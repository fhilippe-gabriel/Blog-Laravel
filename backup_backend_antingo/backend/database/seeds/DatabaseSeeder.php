<?php

use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    public function run()
    {
        $this->call(UserSeeder::class);
        $this->call(ClienteSeeder::class);
        $this->call(ProjetoSeeder::class);
        $this->call(TipoAtividadeSeeder::class);
        $this->call(JornadaSeeder::class);
        $this->call(CargoSeeder::class);
        $this->call(FuncionarioSeeder::class);
        $this->call(ExameSeeder::class);
        $this->call(CertificadoSeeder::class);
        $this->call(FuncionarioCertificadoSeeder::class);
        $this->call(FuncionarioExameSeeder::class);
        $this->call(PassportDevelopmentCredentialsSeeder::class);
        $this->call(TarifaSeeder::class);
        $this->call(TipoRecursoSeeder::class);
        $this->call(EquipamentoSeeder::class);
        $this->call(TarifaPrecoSeeder::class);
        $this->call(TipoFaturamentoSeeder::class);
        $this->call(AtividadeSeeder::class);
        $this->call(UpdateMatriculaFuncionarioSeeder::class);
    }
}
