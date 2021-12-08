<?php

use Illuminate\Database\Seeder;
use App\Models\Funcionario;

class UpdateMatriculaFuncionarioSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        $matriculas = [ 183, 211, 340, 213, 65, 123, 326, 114,
                        289, 217, 199, 104, 221, 336, 334, 410,
                        337, 384, 45, 343, 136, 153, 89, 44, 335,
                        341, 313, 281, 121, 229, 66, 353, 139, 360]
        ;

        foreach ($matriculas as $matricula) {
            $funcionario = Funcionario::inRandomOrder()->where('matricula', NULL)->first();
            $funcionario->matricula = $matricula;
            $funcionario->save();
        }
    }
}
