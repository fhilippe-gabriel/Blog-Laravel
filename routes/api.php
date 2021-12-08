<?php

use App\Http\Controllers\PostController;
use App\Http\Controllers\UserController;
use Illuminate\Support\Facades\Route;

// user controller routes
Route::post('/register', [AuthController::class, 'register']);
Route::post('/login', [AuthController::class, 'login'])->name('login');
// sanctum auth middleware routes

Route::middleware('auth:api')->group(function () {

    Route::get("user", [UserController::class, "user"]);

    Route::resource('post', PostController::class);

});
