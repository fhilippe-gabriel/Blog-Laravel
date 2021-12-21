<?php

use App\Http\Controllers\AlunoController;
use App\Http\Controllers\ContatosController;
use App\Http\Controllers\MatriculaController;
use App\Http\Controllers\ResponsavelController;
use App\Http\Controllers\SaudeController;
use App\Http\Controllers\UserController;
use App\Http\Controllers\UserMatriculaController;
use Illuminate\Support\Facades\Route;

// user controller routes
Route::post("register", [UserController::class, "register"]);
Route::post("new", [UserMatriculaController::class, "register"]);

Route::post("login", [UserController::class, "login"]);
Route::post("complete", [UserMatriculaController::class, "login"]);

// sanctum auth middleware routes

Route::middleware('auth:api')->group(function () {

    Route::get("user", [UserController::class, "user"]);
    Route::prefix('matricula')->group(function () {
        Route::resource('/', MatriculaController::class);
        Route::resource('saude', SaudeController::class);
        Route::resource('responsaveis', ResponsavelController::class);
        Route::resource('aluno', AlunoController::class);
        Route::resource('contatos', ContatosController::class);
        Route::resource('getCpf', AlunoController::class);
    });
});