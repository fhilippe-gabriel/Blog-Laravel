<?php

use App\Http\Controllers\AuthController;
use App\Http\Controllers\PosteController;
use Illuminate\Support\Facades\Route;

Route::post('/register', [AuthController::class, 'register']);
Route::post('/login', [AuthController::class, 'login'])->name('login');

Route::middleware('auth:api')->group(function () {
    Route::resource('poste', PosteController::class);
});