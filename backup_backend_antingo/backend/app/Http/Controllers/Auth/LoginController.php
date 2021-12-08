<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Providers\RouteServiceProvider;
use Illuminate\Foundation\Auth\AuthenticatesUsers;

class LoginController extends Controller
{
    /*
    |--------------------------------------------------------------------------
    | Login Controller
    |--------------------------------------------------------------------------
    |
    | This controller handles authenticating users for the application and
    | redirecting them to your home screen. The controller uses a trait
    | to conveniently provide its functionality to your applications.
    |
    */

    /**
     * @OA\Post(
     *     path="/oauth/token",
     *     tags={"Autenticação"},
     *     summary="Autenticacao Api para consumo de dados",
     *     description="A sample greeting to test out the API",
     *     operationId="login",
     *     @OA\RequestBody(
     *         @OA\MediaType(
     *             mediaType="application/json",
     *             @OA\Schema(
     *                 @OA\Property(
     *                     property="grant_type",
     *                     type="string"
     *                 ),
     *                 @OA\Property(
     *                     property="client_id",
     *                     type="string"
     *                 ),
     *                 @OA\Property(
     *                     property="client_secret",
     *                     type="string"
     *                 ),
     *                 @OA\Property(
     *                     property="username",
     *                     type="string"
     *                 ),
     *                 @OA\Property(
     *                     property="password",
     *                     type="string"
     *                 ),
     *                 example={
     *                     "grant_type": "password",
     *                     "client_id": "1",
     *                     "client_secret": "b89f58iIL45t8ftsaqGQUXm3LLFP4xO75FbSc9Dc",
     *                     "username": "email@gmail.com",
     *                     "password": "123456"
     *                 }
     *             )
     *         )
     *     ),
     *     @OA\Response(
     *         response="200",
     *         description="successful operation"
     *     ),
     *     @OA\Response(
     *         response="401",
     *         description="Não autorizado"
     *     )
     * )
     */

    use AuthenticatesUsers;

    /**
     * Where to redirect users after login.
     *
     * @var string
     */
    protected $redirectTo = RouteServiceProvider::HOME;

    /**
     * Create a new controller instance.
     *
     * @return void
     */
    public function __construct()
    {
        $this->middleware('guest')->except('logout');
    }
}
