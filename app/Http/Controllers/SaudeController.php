<?php

namespace App\Http\Controllers;

use App\Models\Saude;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Validator;

class SaudeController extends Controller
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
            $saude = Saude::where("user_id", $user->id)->get();

            if (count($saude) > 0) {
                return response()->json(["status" => "success", "count" => count($saude), "data" => [$saude]], 200);
            } else {
                return response()->json(["status" => "failed", "count" => count($saude), "message" => "Falha! Saude não encontrada!!"], 200);
            }
        }
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
                "hospital" => "nullable",
                "planoSaude" => "nullable",
                "problemaSaude" => "nullable",
                "alergia" => "nullable",
                "PNE" => "nullable",
                "periodo" => "nullable",
            ]);

            if ($validator->fails()) {
                return response()->json(["status" => "failed", "validation_errors" => $validator->errors()]);
            }

            $saudeInput = $request->all();
            $saudeInput['user_id'] = $user->id;

            $saude = Saude::create($saudeInput);
            if (!is_null($saude)) {
                return response()->json(["status" => "success", "message" => "Successo! Saude criada!!", "data" => [$saude]]);
            } else {
                return response()->json(["status" => "failed", "message" => "Oppppaaaa! Saude não foi criada!!"]);
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
            $saude = Saude::where("user_id", $user->id)->where("id", $id)->first();
            if (!is_null($saude)) {
                return response()->json(["status" => "success", "data" => [$saude]], 200);
            } else {
                return response()->json(["status" => "failed", "message" => "Falhou! Saude não encontrada!!"], 200);
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
    public function update(Request $request, Saude $saude)
    {
        $input = $request->all();
        $user = Auth::user();

        if (!is_null($user)) {
            $validator = Validator::make($request->all(), [
                "hospital" => "nullable",
                "planoSaude" => "nullable",
                "problemaSaude" => "nullable",
                "alergia" => "nullable",
                "PNE" => "nullable",
                "periodo" => "nullable",
            ]);

            if ($validator->fails()) {
                return response()->json(["status" => "failed", "validation_errors" => $validator->errors()]);
            }

            // update saude
            $saude->update($request->all());

            return response()->json(["status" => "success", "message" => "Success! post updated", "data" => [$saude]], 200);

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
    public function destroy($id, Saude $saude)
    {
        $user = Auth::user();

        if (!is_null($user)) {
            $saude = Saude::where("id", $saude)->where("user_id", $user->id)->delete();
            return response()->json(["status" => "success", "message" => "Successo! Saude deletada!!"], 200);
        } else {
            return response()->json(["status" => "failed", "message" => "Usuario não autorizado!!"], 403);
        }
    }
}