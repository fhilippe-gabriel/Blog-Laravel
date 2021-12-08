<?php

use Illuminate\Support\Facades\Route;

Route::get('/', function () {
    return response()->json(['message' => 'Usuário não autenticado. '], 401);
})->name(401);

Route::any('401', function (){
    return response()->json(['Não autorizado'], 401);
});
