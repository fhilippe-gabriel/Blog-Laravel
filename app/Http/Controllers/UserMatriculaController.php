<?php

namespace App\Http\Controllers;

use App\Models\User;
use App\Models\UserMatricula;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Validator;

class UserMatriculaController extends Controller
{

    // User Register
    public function register(Request $request)
    {
        $validator = Validator::make($request->all(), [
            "name" => "required",
            "email" => "required|email",
            "password" => "required",
        ]);

        if ($validator->fails()) {
            return response()->json(["status" => "failed", "validation_errors" => $validator->errors()]);
        }

        $inputs = $request->all();
        $inputs["password"] = Hash::make($request->password);

        $user = UserMatricula::create($inputs);

        if (!is_null($user)) {
            return response()->json(["status" => "success", "message" => "Successo! registration completed", "data" => $user]);
        } else {
            return response()->json(["status" => "failed", "message" => "Registration failed!"]);
        }
    }

    // User login
    public function login(Request $request)
    {

        $validator = Validator::make($request->all(), [
            "email" => "required|email",
            "password" => "required",
        ]);

        if ($validator->fails()) {
            return response()->json(["validation_errors" => $validator->errors()]);
        }

        $user = UserMatricula::where("email", $request->email)->first();

        if (is_null($user)) {
            return response()->json(["status" => "failed", "message" => "Failed! email not found"]);
        }

        if (Auth::attempt(['email' => $request->email, 'cpf' => $request->cpf])) {
            $user = Auth::user();
            $token = $user->createToken('token')->plainTextToken;

            return response()->json(["status" => "success", "login" => true, "token" => $token, "data" => $user]);
        } else {
            return response()->json(["status" => "failed", "success" => false, "message" => "Whoops! invalid password"]);
        }
    }
    // public function getCPF(Request $request, User $user)
    // {
    //     $input = $request->all();
    //     if(){
    //         $validator = Validator::make($request->all(), [
    //             "CPFAluno" => "require",
    //         ]);
    //         $user = User::getCpf()->first();
    //         return;
    //     }
    // }
    // User Detail
    public function user()
    {
        $user = Auth::user();
        if (!is_null($user)) {
            return response()->json(["status" => "success", "data" => $user]);
        } else {
            return response()->json(["status" => "failed", "message" => "Whoops! no user found"]);
        }
    }
}