<?php

namespace App\Http\Controllers;

use App\Models\Matricula;
use App\Models\User;
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

            if (count($matricula) > 0) {
                return response()->json(["status" => "success", "count" => count($matricula), "data" => [$matricula]], 200);
            } else {
                return response()->json(["status" => "failed", "count" => count($matricula), "message" => "Falha! Matricula não encontrada!!"], 200);
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

            $matriculaInput = $request->all();
            $matriculaInput['user_id'] = $user->id;

            $matricula = Matricula::create($matriculaInput);
            if (!is_null($matricula)) {
                return response()->json(["status" => "success", "message" => "Successo! Matricula criada!!", "data" => [$matricula]]);
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
                return response()->json(["status" => "success", "data" => [$matricula]], 200);
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
    public function update(Request $request, Matricula $matricula)
    {
        $input = $request->all();
        $user = Auth::user();

        if (!is_null($user)) {
            $validator = Validator::make($request->all(), [
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

            // update matricula
            $matricula->update($request->all());

            return response()->json(["status" => "success", "message" => "Success! post updated", "data" => [$matricula]], 200);

        } else {
            return response()->json(["status" => "failed", "message" => "Usuario não autorizado!!"], 403);
        }
    }

    //
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
