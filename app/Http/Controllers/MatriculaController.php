<?php

namespace App\Http\Controllers;

use App\Models\Aluno;
use App\Models\Matricula;
use App\Models\Responsaveis;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Validator;

class MatriculaController extends Controller
{
    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index()
    {

        $user = Auth::user();
        if (!is_null($user)) {
            $matricula = Matricula::where("user_id", $user->id)->get();
            $aluno = Aluno::where("user_id", $user->id)->get();
            $responsaveis = Responsaveis::where("user_id", $user->id)->get();

            $dados = array($matricula[0], $aluno[0], $responsaveis[0]);
            if (count($dados) > 0) {
                return response()->json(["status" => "success", "count" => count($dados), "data" => $dados], 200);
            } else {
                return response()->json(["status" => "failed", "count" => count($dados), "message" => "Falha! Matricula não encontrada!!"], 200);
            }
        }
    }

    /**
     * Cria matricula e adiciona informações auxiliares em tabelas relacionadas.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function store(Request $request)
    {
        // Define usuário Logado
        $user = Auth::user();
        if (!is_null($user)) {
            $validator = Validator::make($request->all(), [
                "turma" => "nullable",
                "nome" => "nullable",
                "nascimento" => "nullable",
                "sexo" => "nullable",
                "periodo" => "nullable",
                "nomeResponsavel" => "nullable",
                "nascimentoResponsavel" => "nullable",
                "RGresponsavel" => "nullable",
                "CPFresponsavel" => "nullable",
                "enderecoResponsavel" => "nullable",
                "CEPresponsavel" => "nullable",
                "celularResponsavel" => "nullable",
                "telefonecasaResponavel" => "nullable",
                "telefonecomercialResponavel" => "nullable",
                "emailResponavel" => "nullable",
                "contatoAvosMaternos" => "nullable",
                "contatoAvosPaternos" => "nullable",
                "contatoPediatrA" => "nullable",
                "contatoOutros" => "nullable",
                "autorizado1" => "nullable",
                "parentescoAutorizado1" => "nullable",
                "rgAutorizado1" => "nullable",
                "autorizado2" => "nullable",
                "avisarEmergencia" => "nullable",
                "hospital" => "nullable",
                "planoSaude" => "nullable",
                "problemaSaude" => "nullable",
                "alergia" => "nullable",
                "PNE" => "nullable",
                "anexoCertidãoNasicmento" => "nullable",
                "anexoRgAluno" => "nullable",
                "anexoTransferenciaAluno" => "nullable",
                "anexoHistoricoEscolar" => "nullable",
                "anexoComprovantePagamento" => "nullable",
                "anexoRgResponsavelContrato" => "nullable",
                "anexoCpfResponsavelContrato" => "nullable",
                "anexoComprovanteresidencial" => "nullable",
                "anexoVacina" => "nullable",
                "perfilAluno" => "nullable",
            ]);

            if ($validator->fails()) {
                return response()->json([
                    "status" => "failed",
                    "validation_errors" => $validator->errors(),
                    "message" => "Erro na validação",
                ]);
            }

            $matriculaInput = $request->all();
            $matriculaInput['user_id'] = $user->id;

            $alunoInput = Aluno::create($matriculaInput);
            $responsaveisInput = Responsaveis::create($matriculaInput);
            $matricula = Matricula::create($matriculaInput);
            if (!is_null($matricula)) {
                return response()->json(["status" => "success", "message" => "Successo! Matricula criada!!", "data" => [$responsaveisInput, $alunoInput, $matricula]]);
            } else {
                return response()->json(["status" => "failed", "message" => "Oppppaaaa! Matricula não foi criada!!"]);
            }
        }
    }

    /**
     * Display the specified resource.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function show($id)
    {
        $user = Auth::user();
        if (!is_null($user)) {
            $matricula = Matricula::where("user_id", $user->id)->where("id", $id)->first();
            if (!is_null($matricula)) {
                return response()->json(["status" => "success", "data" => $matricula], 200);
            } else {
                return response()->json(["status" => "failed", "message" => "Falhou! Matricula não encontrada!!"], 200);
            }
        } else {
            return response()->json(["status" => "failed", "message" => "Usuario não autorizado!!"], 403);
        }
    }

    /**
     * Atualiza Matricula com base no ID
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function update(Request $request, Matricula $matricula, Aluno $aluno)
    {
        $input = $request->all();
        $user = Auth::user();

        if (!is_null($user)) {
            $validator = Validator::make($request->all(), [
                "turma" => "nullable",
                "nome" => "nullable",
                "nascimento" => "nullable",
                "sexo" => "nullable",
                "periodo" => "nullable",
                "nomeResponsavel1" => "nullable",
                "nascimentoResponsavel1" => "nullable",
                "rgResponsavel1" => "nullable",
                "cpfResponsavel1" => "nullable",
                "enderecoResponsavel1" => "nullable",
                "cepResponsavel1" => "nullable",
                "celularResponsavel1" => "nullable",
                "telefonecasaResponsavel1" => "nullable",
                "telefonecomericalResponsavel1" => "nullable",
                "emailResponsavel1" => "nullable",
                "nomeResponsavel2" => "nullable",
                "nascimentoResponsavel2" => "nullable",
                "rgResponsavel2" => "nullable",
                "cpfResponsavel2" => "nullable",
                "enderecoResponsavel2" => "nullable",
                "cepResponsavel2" => "nullable",
                "celularResponsavel2" => "nullable",
                "telefonecasaResponsavel2" => "nullable",
                "telefonecomericalResponsavel2" => "nullable",
                "emailResponsavel2" => "nullable",
                "contatoAvosMaternos" => "nullable",
                "contatoAvosPaternos" => "nullable",
                "contatoPediatrA" => "nullable",
                "contatoOutros" => "nullable",
                "autorizado1" => "nullable",
                "parentescoAutorizado1" => "nullable",
                "rgAutorizado1" => "nullable",
                "autorizado2" => "nullable",
                "avisarEmergencia" => "nullable",
                "hospital" => "nullable",
                "planoSaude" => "nullable",
                "problemaSaude" => "nullable",
                "alergia" => "nullable",
                "PNE" => "nullable",
                "anexoCertidãoNasicmento" => "nullable",
                "anexoRgAluno" => "nullable",
                "anexoTransferenciaAluno" => "nullable",
                "anexoHistoricoEscolar" => "nullable",
                "anexoComprovantePagamento" => "nullable",
                "anexoRgResponsavelContrato" => "nullable",
                "anexoCpfResponsavelContrato" => "nullable",
                "anexoComprovanteresidencial" => "nullable",
                "anexoVacina" => "nullable",
                "perfilAluno" => "nullable",
            ]);

            if ($validator->fails()) {
                return response()->json(["status" => "failed", "validation_errors" => $validator->errors()]);
            }
            $aluno->update($request->all());

            $matricula->update($request->all());
            // update matricula

            // $aluno = Aluno::class();
            // $aluno->findOrFail([user_id = $matricula['user_id']]);

            // $aluno->update($request->all());

            return response()->json(["status" => "success", "message" => "Successo! Matricula atualizada!!", "data" => [$matricula, $aluno]], 200);

        } else {
            return response()->json(["status" => "failed", "message" => "Usuario não autorizado!!"], 403);
        }
    }

    /**
     * Deleta uma matricula com base no ID.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function destroy(Matricula $matricula)
    {
        $user = Auth::user();

        if (!is_null($user)) {
            $matricula = Matricula::where("id", $matricula)->where("user_id", $user->id)->delete();
            return response()->json(["status" => "success", "message" => "Successo! Matricula deletada!!"], 200);
        } else {
            return response()->json(["status" => "failed", "message" => "Usuario não autorizado!!"], 403);
        }
    }
}