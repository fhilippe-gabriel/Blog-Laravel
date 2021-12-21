<?php

namespace App\Http\Controllers;

use App\Models\Aluno;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Validator;

class AlunoController extends Controller
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
            $aluno = Aluno::where("user_id", $user->id)->get();
            if (count($aluno) > 0) {
                return response()->json(["status" => "success", "count" => count($aluno), "data" => [$aluno]], 200);
            } else {
                return response()->json(["status" => "failed", "count" => count($aluno), "message" => "Falha! Aluno não encontrada!!"], 200);
            }
        }
    }
    /**
     * Cria aluno e adiciona informações auxiliares em tabelas relacionadas.
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
            ]);

            if ($validator->fails()) {
                return response()->json(["status" => "failed", "validation_errors" => $validator->errors()]);
            }

            $aluno = $request->all();
            $aluno['user_id'] = $user->id;

            $aluno = Aluno::create($aluno);
            if (!is_null($aluno)) {
                return response()->json(["status" => "success", "message" => "Successo! Aluno criada!!", "data" => [$aluno]]);
            } else {
                return response()->json(["status" => "failed", "message" => "Oppppaaaa! Aluno não foi criada!!"]);
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
            $aluno = Aluno::where("user_id", $user->id)->where("id", $id)->first();
            if (!is_null($user)) {
                return response()->json(["status" => "success", "data" => [$aluno]], 200);
            } else {
                return response()->json(["status" => "failed", "message" => "Falhou! Aluno não encontrada!!"], 200);
            }
        } else {
            return response()->json(["status" => "failed", "message" => "Usuario não autorizado!!"], 403);
        }
    }
    /**
     * Atualiza Aluno com base no ID
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function update(Request $request, Aluno $aluno)
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
            ]);

            if ($validator->fails()) {
                return response()->json(["status" => "failed", "validation_errors" => $validator->errors()]);
            }

            // update aluno
            $aluno->update($request->all());

            return response()->json(["status" => "success", "message" => "Success! post updated", "data" => [$aluno]], 200);

        } else {
            return response()->json(["status" => "failed", "message" => "Usuario não autorizado!!"], 403);
        }
    }

    public function getCpf(Request $request)
    {

        dd($request->al)

    }

}