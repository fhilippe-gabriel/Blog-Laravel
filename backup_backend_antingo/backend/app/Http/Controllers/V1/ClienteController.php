<?php

namespace App\Http\Controllers\V1;

use App\Models\Cliente;
use App\Rules\CadastroPessoaJuridica;
use Exception;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use App\Http\Controllers\Controller;
use Illuminate\Support\Facades\Validator;
use Spatie\QueryBuilder\QueryBuilder;
use Spatie\QueryBuilder\AllowedFilter;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Storage;
use Illuminate\Validation\Rule;

class ClienteController extends Controller
{

    /**
     * @OA\Get(
     *   path="/v1/clientes",
     *   tags={"Clientes"},
     *   summary="Retorna os clientes cadastrados no banco",
     *   description="Retorna todos os clientes cadastrados no banco, ainda é possível incluir os dados dos **projetos** do cliente",
     *   operationId="cliente_index",
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
     *     description="Lista de projetos"
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
            $clientes = Cliente::with('projetos')->orderBy('nome_fantasia')->get();
        } else {
            $clientes = Cliente::with('projetos')->orderBy('nome_fantasia')->paginate(self::getPageNumber($request));
        }

        if (is_null($clientes)){
            return response()->json([], 204);
        }

        return response()->json($clientes);
    }

    /**
     * @OA\Get(
     *     path="/v1/cliente/{id}",
     *     tags={"Clientes"},
     *     summary="Retorna um cliente via id cadastrado no banco",
     *     description="A sample greeting to test out the API",
     *     operationId="cliente_show",
     *     security={{"passport": {"*"}}},
     *     @OA\Parameter(
     *         name="id",
     *         in="path",
     *         description="ID of cliente to return",
     *         required=true,
     *         @OA\Schema(
     *             type="integer",
     *             format="int64"
     *         )
     *     ),
     *     @OA\Response(
     *       @OA\MediaType(mediaType="application/json"),
     *       response=200,
     *       description="Retorna um Cliente"
     *     ),
     *     @OA\Response(
     *       @OA\MediaType(mediaType="application/json"),
     *       response="401",
     *       description="Não autorizado. "
     *     ),
     *     @OA\Response(
     *       @OA\MediaType(mediaType="application/json"),
     *       response="default",
     *       description="Erro"
     *     )
     * )
     * @param Request $request
     * @param int $clientId
     * @return JsonResponse
     */
    public function show(Request $request, int $clientId)
    {
        try {
            $cliente = Cliente::with('projetos')->find($clientId);

            if (is_null($cliente))
                return response()->json(['message' => 'Cliente não encontrado.'], 404);

            return response()->json(compact('cliente'));

        } catch (Exception $exception) {
            return response()->json(['message' => self::MESSAGE_HTTP_ERROR_500], 500);
        }
    }

    /**
     * @OA\Post(
     *     path="/v1/cliente",
     *     tags={"Clientes"},
     *     summary="Cadastra um cliente no banco",
     *     description="Exemplo de como cadastrar cliente via API",
     *     operationId="cliente_register",
     *     security={{"passport": {"*"}}},
     *     @OA\RequestBody(
     *         @OA\MediaType(
     *             mediaType="multipart/form-data",
     *             @OA\Schema(
     *                 required={
     *                      "razao_social",
     *                      "cnpj"
     *                 },
     *                 @OA\Property(
     *                     property="razao_social",
     *                     type="string"
     *                 ),
     *                  @OA\Property(
     *                     property="nome_fantasia",
     *                     type="string"
     *                 ),
     *                  @OA\Property(
     *                     property="cnpj",
     *                     type="string"
     *                 ),
     *                  @OA\Property(
     *                     property="contato_nome",
     *                     type="string"
     *                 ),
     *                  @OA\Property(
     *                     property="contato_cargo",
     *                     type="string"
     *                 ),
     *                  @OA\Property(
     *                     property="contato_fone",
     *                     type="string"
     *                 ),
     *                  @OA\Property(
     *                     property="logo",
     *                     type="file",
     *                 ),
     *                  @OA\Property(
     *                     property="codigo_cliente",
     *                     type="string"
     *                 ),
     *                 example={
     *                     "razao_social": "Evie Kilback",
     *                     "nome_fantasia": "Landen Marvin",
     *                     "cnpj": "00250178000190",
     *                     "contato_nome": "Danielle Schulist",
     *                     "contato_cargo": "Plant and System Operator",
     *                     "contato_fone": "938-337-1984",
     *                     "logo": "Logo do cliente",
     *                     "codigo_cliente": "123",
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
     * @param Request $request
     * @return JsonResponse
     */
    public function store(Request $request)
    {
        try {
            DB::beginTransaction();
            $inputData = $request->all();

            $validator = $this->isValid($this->sanitize($request));

            if ($validator->fails()) {
                DB::rollBack();
                return response()->json(['message' => $validator->errors()], 400);
            }

            $cliente = Cliente::create($request->all());

            if ($files = $request->file('logo')) {
                $file = $request->file('logo');
                $file = $request->logo->store($cliente->id . '/imagens', 'minio');
                $cliente->logo = $file;
                $cliente->save();
            }

            DB::commit();

            return response()->json(compact('cliente'), 201);

        } catch (Exception $exception) {
            DB::rollBack();
            return response()->json(['message' => self::MESSAGE_HTTP_ERROR_500], 500);
        }
    }

    /**
     * @OA\Post(
     *     path="/v1/cliente/{id}",
     *     tags={"Clientes"},
     *     summary="Atualiza um cliente no banco",
     *     description="Exemplo de como atualizar um cliente via API",
     *     operationId="cliente_update",
     *     security={{"passport": {"*"}}},
     *     @OA\Parameter(
     *         name="id",
     *         in="path",
     *         description="ID of cliente to return",
     *         required=true,
     *         @OA\Schema(
     *             type="integer",
     *             format="int64"
     *         )
     *     ),
     *     @OA\RequestBody(
     *         @OA\MediaType(
     *             mediaType="multipart/form-data",
     *             @OA\Schema(
     *                 required={
     *                      "razao_social",
     *                      "cnpj"
     *                 },
     *                 @OA\Property(
     *                     property="razao_social",
     *                     type="string"
     *                 ),
     *                  @OA\Property(
     *                     property="nome_fantasia",
     *                     type="string"
     *                 ),
     *                  @OA\Property(
     *                     property="cnpj",
     *                     type="string"
     *                 ),
     *                  @OA\Property(
     *                     property="contato_nome",
     *                     type="string"
     *                 ),
     *                  @OA\Property(
     *                     property="contato_cargo",
     *                     type="string"
     *                 ),
     *                  @OA\Property(
     *                     property="contato_fone",
     *                     type="string"
     *                 ),
     *                  @OA\Property(
     *                     property="logo",
     *                     type="file"
     *                 ),
     *                  @OA\Property(
     *                     property="codigo_cliente",
     *                     type="string"
     *                 ),
     *                 example={
     *                     "razao_social": "Evie Kilback",
     *                     "nome_fantasia": "Landen Marvin",
     *                     "cnpj": "00250178000190",
     *                     "contato_nome": "Danielle Schulist",
     *                     "contato_cargo": "Plant and System Operator",
     *                     "contato_fone": "938-337-1984",
     *                     "codigo_cliente": "123456",
     *                     "logo": "Logo do cliente",
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
     * @param Request $request
     * @param int $clienteId
     * @return JsonResponse
     */
    public function update(Request $request, int $clienteId)
    {
        // try {
            DB::beginTransaction();
            $cliente = Cliente::find($clienteId);

            if (is_null($cliente)){
                DB::rollBack();
                return response()->json(['message' => __('geral.geral_nao_encontrado')], 404);
            }

            $validator = $this->isValid($this->sanitize($request));

            if ($validator->fails()) {
                DB::rollBack();
                return response()->json(['message' => $validator->errors()], 400);
            }

            if(!$cliente->update($request->all())){
                DB::rollBack();
                return response()->json(['message' => __('geral.geral_atualizado_erro')], 400);
            }

            if ($files = $request->file('logo')) {
                $file = $request->file('logo')->store($cliente->id . '/imagens', 'minio');

                $cliente->logo = $file;
                $cliente->save();
            }

            DB::commit();
            return response()->json(['message' => __('geral.geral_atualizado_sucesso')], 200);

        // }
        // catch (Exception $exception) {
        //     DB::rollBack();
        //     return response()->json(['message' => self::MESSAGE_HTTP_ERROR_500], 500);
        // }
    }

    /**
     * @OA\Delete(
     *     path="/v1/cliente/{id}",
     *     tags={"Clientes"},
     *     summary="Deleta um cliente via id",
     *     description="Deleta um cliente via id",
     *     operationId="cliente_delete",
     *     security={{"passport": {"*"}}},
     *     @OA\Parameter(
     *         name="id",
     *         in="path",
     *         description="ID do cliente para deletar",
     *         required=true,
     *         @OA\Schema(
     *             type="integer",
     *             format="int64"
     *         )
     *     ),
     *     @OA\Response(
     *       @OA\MediaType(mediaType="application/json"),
     *       response=200,
     *       description="Cliente escluído"
     *     ),
     *     @OA\Response(
     *       @OA\MediaType(mediaType="application/json"),
     *       response="401",
     *       description="Não autorizado. "
     *     ),
     *     @OA\Response(
     *       @OA\MediaType(mediaType="application/json"),
     *       response="default",
     *       description="Erro"
     *     )
     * )
     * @param int $clienteId
     * @return JsonResponse
     */
    public function destroy(int $clienteId)
    {
        try {

            $cliente = Cliente::find($clienteId);

            if (is_null($cliente))
                return response()->json(['message' => 'Cliente não encontrado. '], 404);

            $cliente->delete();

            return response()->json([], 204);

        } catch (Exception $exception) {
            return response()->json(['message' => self::MESSAGE_HTTP_ERROR_500], 500);
        }
    }

    /**
     * Search in the model.
     *
     * @OA\GET(
     *     path="/v1/cliente/search",
     *     tags={"Clientes"},
     *     summary="Pesquisa clientes.",
     *     description="Pesquisa clientes.",
     *     operationId="cliente_search",
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
     *         name="filter[razao_social]",
     *         in="query",
     *         description="Razão social do cliente a ser pesquisado",
     *         required=false,
     *         @OA\Schema(
     *             type="string",
     *             format="text"
     *         )
     *     ),
     *     @OA\Parameter(
     *         name="filter[nome_fantasia]",
     *         in="query",
     *         description="Nome fantasia do cliente a ser pesquisado",
     *         required=false,
     *         @OA\Schema(
     *             type="string",
     *             format="text"
     *         )
     *     ),
     *     @OA\Parameter(
     *         name="filter[cnpj]",
     *         in="query",
     *         description="CNPJ do cliente a ser pesquisado",
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
        $clientes = QueryBuilder::for( Cliente::class )
            ->allowedFilters(['razao_social', 'nome_fantasia', AllowedFilter::exact( 'cnpj' )])
            ->defaultSort('nome_fantasia')
            ->paginate( $perPage )
            ->appends( $request->query() );

        if ( count( $clientes ) == 0){
            return response()->json([], 204);
        }

        return response()->json(compact( 'clientes' ));
    }

    /**
     * Sanitize fields
     * @param Request $request
     * @throws Request
     */
    private function sanitize(Request $request)
    {
        $input = $request->all();

        if(isset($input['cnpj'])){
            $input['cnpj'] = preg_replace('/[^0-9]/is', '', $input['cnpj']);
        }
        if(isset($input['contato_fone'])){
            $input['contato_fone'] = preg_replace('/[^0-9]/is', '', $input['contato_fone']);
        }

        $request->replace($input);
        return $request;
    }

    /**
     * Validate all fields
     * Caso não seja atendido retorna erro 422
     * @param Request $request
     * @throws ValidationException
     */
    private function isValid(Request $request)
    {
        return Validator::make($request->all(), [
            'cnpj'               => [
                'regex:/^[0-9]+$/',
                'required',
                'min:14',
                'max:14',
                Rule::unique('clientes')->ignore($request->id),
                new CadastroPessoaJuridica,
            ],
            'razao_social' => 'required|max:150',
            'nome_fantasia' => 'nullable|max:150',
            'contato_nome' => 'nullable|max:150',
            'contato_cargo' => 'nullable|max:150',
            'contato_fone' => [
                'integer',
                'nullable'
            ],
            'logo' => 'nullable|mimes:png,jpg,jpeg,svg|max:2048',
            'codigo_cliente' => 'integer|nullable'
        ]);
    }
}
