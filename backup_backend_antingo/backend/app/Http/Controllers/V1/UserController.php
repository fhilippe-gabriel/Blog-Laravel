<?php

namespace App\Http\Controllers\V1;

use App\Http\Controllers\Controller;
use App\Models\User;
use Exception;
use Illuminate\Validation\Rule;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\DB;
use Spatie\QueryBuilder\QueryBuilder;

class UserController extends Controller
{
    /**
     * Display a listing of the resource.
     *
     * @OA\Get(
     *   path="/v1/usuarios",
     *   summary="Retorna os usuário.",
     *   description="Retorna os usuário que são aceitas pelo sistema.",
     *   tags={"Usuários"},
     *   security={{"passport": {"*"}}},
     *   @OA\Parameter(
     *       name="per_page",
     *       in="query",
     *       description="Indica quantos itens serão retornados por página.",
     *       required=false,
     *       @OA\Schema(
     *           type="string",
     *           enum={"10","20","30","40", "all"},
     *           default=10
     *       )
     *   ),
     *   @OA\Response(
     *     @OA\MediaType(mediaType="application/json"),
     *     response=200,
     *     description="Lista de usuário"
     *   ),
     *   @OA\Response(
     *     @OA\MediaType(mediaType="application/json"),
     *     response="401",
     *     description="Não autorizado. "
     *   ),
     *   @OA\Response(
     *     @OA\MediaType(mediaType="application/json"),
     *     response="204",
     *     description="Sem conteúdo"
     *   )
     * )
     * @param Request $request
     * @return JsonResponse
     */
    public function index(Request $request)
    {
        if($request->per_page === 'all') {
            $users = User::orderBy('name')->get();
        } else {
            $users = User::orderBy('name')->paginate(self::getPageNumber($request));
        }

        if (is_null($users)){
            return response()->json([], 204);
        }

        return response()->json($users);
    }

    /**
     * @OA\Get(
     *     path="/v1/usuario/{id}",
     *     tags={"Usuários"},
     *     summary="Retorna um usuário via id cadastrado no banco de dados",
     *     description="Retorna um usuário via id",
     *     operationId="tipo_recurso_show",
     *     security={{"passport": {"*"}}},
     *     @OA\Parameter(
     *         name="id",
     *         in="path",
     *         description="ID of tipo recurso to return",
     *         required=true,
     *         @OA\Schema(
     *             type="integer",
     *             format="int64"
     *         )
     *     ),
     *     @OA\Response(
     *       @OA\MediaType(mediaType="application/json"),
     *       response=200,
     *       description="Retorna um usuário"
     *     ),
     *     @OA\Response(
     *       @OA\MediaType(mediaType="application/json"),
     *       response="401",
     *       description="Não autorizado. "
     *     ),
     *     @OA\Response(
     *       @OA\MediaType(mediaType="application/json"),
     *       response="404",
     *       description="Usuário não encontrado"
     *     )
     * )
     * @param int $funcionarioId
     * @return JsonResponse
     */
    public function show(int $userId)
    {
        try {
            $user = User::find($userId);

            if (is_null($user)) {
                return response()->json(['message' => __('geral.geral_nao_encontrado')], 404);
            }

            return response()->json(compact('user'), 201);

        } catch (Exception $exception) {
            return response()->json(['message' => self::MESSAGE_HTTP_ERROR_500], 500);
        }
    }

    /**
     * @OA\Put(
     *     path="/v1/usuario/{id}",
     *     tags={"Usuários"},
     *     summary="Atualiza um usuário.",
     *     description="Atualiza um usuário.",
     *     operationId="usuário_update",
     *     security={{"passport": {"*"}}},
     *     @OA\Parameter(
     *         name="id",
     *         in="path",
     *         description="ID do usuário",
     *         required=true,
     *         @OA\Schema(
     *             type="integer",
     *             format="int64"
     *         )
     *     ),
     *     @OA\RequestBody(
     *         @OA\MediaType(
     *             mediaType="application/json",
     *             @OA\Schema(
     *                 required={
     *                      "name",
     *                      "email",
     *                      "password"
     *                 },
     *                  @OA\Property(
     *                     property="name",
     *                     type="string"
     *                 ),
     *                 @OA\Property(
     *                     property="email",
     *                     type="integer"
     *                 ),
     *                  @OA\Property(
     *                     property="password",
     *                     type="string"
     *                 ),
     *                  @OA\Property(
     *                     property="password_confirmation",
     *                     type="string"
     *                 ),
     *                 example={
     *                     "name": "Nome do usuário",
     *                     "email": "usuario@sissgo.com.br",
     *                     "password": "123456",
     *                     "password_confirmation": "123456"
     *                 }
     *             )
     *         )
     *     ),
     *     @OA\Response(
     *         response="200",
     *         description="Usuário atualizado"
     *     ),
     *     @OA\Response(
     *         response="400",
     *         description="Erro ao atualizar"
     *     ),
     *     @OA\Response(
     *         response="404",
     *         description="Usuário não encontrado"
     *     ),
     *     @OA\Response(
     *         response="401",
     *         description="Não autorizado"
     *     )
     * )
     * @param Request $request
     * @param int $equipamentoId
     * @return JsonResponse
     */
    public function update(Request $request, int $userId)
    {
        try {

            DB::beginTransaction();
            $user = User::findOrFail($userId);

            if (is_null($user)) {
                DB::rollBack();
                return response()->json(['message' => 'Usuário não encontrado. '], 404);
            }

            if ($request->has('password')) {
                $validate = [
                    'name' => 'required',
                    'email' => [
                        'required',
                        Rule::unique('Users')->ignore($user->id)
                    ],  
                    'password' => 'required',
                    'password_confirmation' => 'required|same:password',
                ];
            } else {
                $request->except(['password']);
                $validate = [
                    'name' => 'required',
                    'email' => [
                        'required',
                        Rule::unique('Users')->ignore($user->id)
                    ]
                ];
            }

            $validator = Validator::make($request->all(), $validate);

            if ($validator->fails()) {
                DB::rollBack();
                return response()->json(['message' => $validator->errors()], 400);
            }

            if ($request->has('password')) {
                $request->merge([
                    'password' => bcrypt($request->password),
                    'password_confirmation' => bcrypt($request->password_confirmation),
                ]);
            }

            if(!$user->update($request->all())){
                DB::rollBack();
                return response()->json(['message' => __('geral.geral_atualizado_erro')], 400);
            }

            DB::commit();
            return response()->json(['message' => __('geral.geral_atualizado_sucesso')], 200);

        } catch (Exception $exception) {
            DB::rollBack();
            return response()->json(['message' => self::MESSAGE_HTTP_ERROR_500], 500);
        }
    }


    /**
     * Register api
     *
     * @param Request $request
     * @return JsonResponse
     */

    /**
     * @OA\Post(
     *     path="/v1/cadastrar",
     *     tags={"Autenticação"},
     *     summary="Cria usuário para acesso ao sistema",
     *     description="Cria usuário para acesso ao sistema",
     *     operationId="cadastro",
     *     @OA\RequestBody(
     *         @OA\MediaType(
     *             mediaType="application/json",
     *             @OA\Schema(
     *                 @OA\Property(
     *                     property="name",
     *                     type="string"
     *                 ),
     *                 @OA\Property(
     *                     property="email",
     *                     type="string"
     *                 ),
     *                 @OA\Property(
     *                     property="password",
     *                     type="string"
     *                 ),
     *                 @OA\Property(
     *                     property="password_confirmation",
     *                     type="string"
     *                 ),
     *                 example={
     *                     "name": "Ricardo",
     *                     "email": "ricardo@gmail.com",
     *                     "password": "123456789",
     *                     "password_confirmation": "123456789"
     *                 }
     *             )
     *         )
     *     ),
     *     @OA\Response(
     *         response="200",
     *         description="successful operation"
     *     )
     * )
     */
    public function register(Request $request)
    {
        try {
            $input = $request->all();

            $validator = self::validateInputRequest($input);

            if ($validator->fails()) {
                return response()->json(['message' => $validator->errors()], 401);
            }

            $input['password'] = bcrypt($input['password']);
            $user = User::create($input);
            return response()->json(compact('user'), 201);

        } catch (Exception $exception) {
            return response()->json(['message' => self::MESSAGE_HTTP_ERROR_500], 500);
        }
    }

    /**
     * @OA\Post(
     *     path="/v1/usuario",
     *     tags={"Usuários"},
     *     summary="Cadastra um novo usuário.",
     *     description="Cadastra um novo usuário.",
     *     operationId="usuario_register",
     *     security={{"passport": {"*"}}},
     *     @OA\RequestBody(
     *         @OA\MediaType(
     *             mediaType="application/json",
     *             @OA\Schema(
     *                 required={
     *                      "name",
     *                      "email",
     *                      "password"
     *                 },
     *                  @OA\Property(
     *                     property="name",
     *                     type="string"
     *                 ),
     *                  @OA\Property(
     *                     property="email",
     *                     type="integer"
     *                 ),
     *                  @OA\Property(
     *                     property="password",
     *                     type="string"
     *                 ),
     *                 example={
     *                     "name": "Nome do usuário",
     *                     "email": "usuario@sissgo.com.br",
     *                     "password": "123456",
     *                     "password_confirmation": "123456"
     *                 }
     *             )
     *         )
     *     ),
     *     @OA\Response(
     *         response="201",
     *         description="successful operation"
     *     ),
     *     @OA\Response(
     *         response="400",
     *         description="Requisão mal formada"
     *     ),
     *     @OA\Response(
     *         response="401",
     *         description="Não autorizado"
     *     )
     * )
     * @param Request $request
     * @return JsonResponse
     */
    public function store(Request $request)
    {
        try {
            $request = $request->all();

            $validator = self::validateInputRequest($request);

            if ($validator->fails()) {
                return response()->json(['message' => $validator->errors()], 400);
            }

            $request['password'] = bcrypt($request['password']);
            $user = User::create($request);

            return response()->json(compact('user'), 201);

        } catch (Exception $exception) {
            return response()->json(['message' => self::MESSAGE_HTTP_ERROR_500], 500);
        }
    }


    private static function validateInputRequest(array $inputData)
    {
        return Validator::make($inputData, [
            'name' => 'required',
            'email' => 'required|email|unique:Users,email',
            'password' => 'required',
            'password_confirmation' => 'required|same:password',
        ]);
    }

    /**
     * Remove the specified resource from storage.
     *
     * @OA\Delete(
     *     path="/v1/usuario/{id}",
     *     tags={"Usuários"},
     *     summary="Deleta um usuário.",
     *     description="Deleta um usuário.",
     *     operationId="usuario_delete",
     *     security={{"passport": {"*"}}},
     *     @OA\Parameter(
     *         name="id",
     *         in="path",
     *         description="ID do usuário para deletar",
     *         required=true,
     *         @OA\Schema(
     *             type="integer",
     *             format="int64"
     *         )
     *     ),
     *     @OA\Response(
     *       @OA\MediaType(mediaType="application/json"),
     *       response=200,
     *       description="Usuário excluído"
     *     ),
     *     @OA\Response(
     *       @OA\MediaType(mediaType="application/json"),
     *       response="401",
     *       description="Não autorizado. "
     *     ),
     *     @OA\Response(
     *         response="404",
     *         description="Usuário não encontrado. "
     *     )
     * )
     * @param int $atividadeId
     * @return JsonResponse
     */
    public function destroy(int $clienteId)
    {
        try {

            DB::beginTransaction();
            $user = User::find($clienteId);

            if (is_null($user)) {
                DB::rollBack();
                return response()->json(['message' => __('geral.geral_nao_encontrado')], 404);
            }

            if($user->delete()){
                DB::commit();
                return response()->json(['message' => __('geral.geral_excluido_sucesso')], 200);
            }

            DB::rollBack();
            return response()->json([], 204);

        } catch (Exception $exception) {
            DB::rollBack();
            return response()->json(['message' => self::MESSAGE_HTTP_ERROR_500], 500);
        }
    }

    /**
     * Search in the model.
     *
     * @OA\GET(
     *     path="/v1/usuario/search",
     *     tags={"Usuários"},
     *     summary="Pesquisa usuarios.",
     *     description="Pesquisa usuarios.",
     *     operationId="usuario_search",
     *     security={{"passport": {"*"}}},
     *     @OA\Parameter(
     *       name="per_page",
     *       in="query",
     *       description="Indica quantos itens serão retornados por página.",
     *       required=false,
     *       @OA\Schema(
     *           type="string",
     *           enum={"10","20","30","40", "all"},
     *           default=10
     *       )
     *     ),
     *     @OA\Parameter(
     *         name="filter[name]",
     *         in="query",
     *         description="Nome do usuário a ser pesquisado",
     *         required=false,
     *         @OA\Schema(
     *             type="string",
     *             format="text"
     *         )
     *     ),
     *     @OA\Parameter(
     *         name="filter[email]",
     *         in="query",
     *         description="E-mail do usuário a ser pesquisado",
     *         required=false,
     *         @OA\Schema(
     *             type="string",
     *             format="text"
     *         )
     *     ),
     *     @OA\Response(
     *       @OA\MediaType(mediaType="application/json"),
     *       response=200,
     *       description="Pesquisa retorna resultados"
     *     ),
     *     @OA\Response(
     *       @OA\MediaType(mediaType="application/json"),
     *       response="401",
     *       description="Não autorizado. "
     *     ),
     *     @OA\Response(
     *         response="204",
     *         description="Pesquisa não retorna resultados. "
     *     )
     * )
     * @param Request $request
     * @return JsonResponse
     */
    public function search(Request $request)
    {
        $perPage = $request->get('perPage') ? $request->get('perPage') : 10;
        $users = QueryBuilder::for(User::class)
            ->allowedFilters(['name', 'email'])
            ->defaultSort('name')
            ->paginate($perPage)
            ->appends($request->query());

        if ( count( $users ) == 0){
            return response()->json([], 204);
        }

        return response()->json(compact('users'));
    }

    public function labels($table = null, $collumn = null)
    {
        if(!is_null($table) && !is_null($collumn)){
            $values = DB::table(ucfirst($table))->select($collumn)->get();
        } else {
            return response()->json(['message' => self::MESSAGE_HTTP_ERROR_500], 500);
        }

        return response()->json($values);
    }
}
