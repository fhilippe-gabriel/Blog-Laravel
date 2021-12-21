<?php

namespace App\Http\Controllers;

use App\Models\Contatos;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Validator;

class ContatosController extends Controller
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
            $contatos = Contatos::where("user_id", $user->id)->get();

            // $dados = array($contatos[0], $aluno[0], $responsaveis[0], $contatos);
            if (count($contatos) > 0) {
                return response()->json(["status" => "success", "count" => count($contatos), "data" => [$contatos]], 200);
            } else {
                return response()->json(["status" => "failed", "count" => count($contatos), "message" => "Falha! Contatos não encontrada!!"], 200);
            }
        }
    }

    /**
     * Show the form for creating a new resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function create()
    {
        //
    }

    /**
     * Store a newly created resource in storage.
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

                "nomeAutorizado" => "nullable",
                "filiacao" => "nullable",
                "telefone" => "nullable",

            ]);

            if ($validator->fails()) {
                return response()->json(["status" => "failed", "validation_errors" => $validator->errors()]);
            }

            $contatoInput = $request->all();
            $contatoInput['user_id'] = $user->id;

            $contatos = Contatos::create($contatoInput);
            if (!is_null($contatos)) {
                return response()->json(["status" => "success", "message" => "Successo! Contatos criada!!", "data" => [$contatos]]);
            } else {
                return response()->json(["status" => "failed", "message" => "Oppppaaaa! Contatos não foi criada!!"]);
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
            $contatos = Contatos::where("user_id", $user->id)->where("id", $id)->first();
            if (!is_null($contatos)) {
                return response()->json(["status" => "success", "data" => [$contatos]], 200);
            } else {
                return response()->json(["status" => "failed", "message" => "Falhou! Contatos não encontrada!!"], 200);
            }
        } else {
            return response()->json(["status" => "failed", "message" => "Usuario não autorizado!!"], 403);
        }
    }

    /**
     * Show the form for editing the specified resource.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function edit($id)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function update(Request $request, Contatos $contatos)
    {
        $input = $request->all();
        $user = Auth::user();

        if (!is_null($user)) {
            $validator = Validator::make($request->all(), [
                "nomeAutorizado" => "nullable",
                "filiacao" => "nullable",
                "telefone" => "nullable",
            ]);

            if ($validator->fails()) {
                return response()->json(["status" => "failed", "validation_errors" => $validator->errors()]);
            }

            // update contatos
            $contatos->update($request->all());
            return response()->json(["status" => "success", "message" => "Success! post updated", "data" => [$contatos]], 200);

        } else {
            return response()->json(["status" => "failed", "message" => "Usuario não autorizado!!"], 403);
        }
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function destroy($id, Contatos $contatos)
    {
        $user = Auth::user();

        if (!is_null($user)) {
            $contatos = Contatos::where("id", $contatos)->where("user_id", $user->id)->delete();
            return response()->json(["status" => "success", "message" => "Successo! Contatos deletada!!"], 200);
        } else {
            return response()->json(["status" => "failed", "message" => "Usuario não autorizado!!"], 403);
        }
    }
}