<?php

namespace App\Http\Controllers\V1;

use App\Http\Controllers\Controller;
use App\Models\Cliente;
use App\Models\Projeto;
use Exception;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use \Illuminate\Contracts\Validation\Validator as ReturnValidator;
use Spatie\QueryBuilder\QueryBuilder;
use Illuminate\Support\Facades\DB;

class ProjetoController extends Controller
{
    /**
     * @OA\Get(
     *   path="/v1/projetos",
     *   summary="Retorna os projetos cadastrados no banco",
     *   description="Retorna todos os projetos cadastrados no banco",
     *   tags={"Projetos"},
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
            $projetos = Projeto::with('cliente')->orderBy('descricao')->get();
        } else {
            $projetos = Projeto::with('cliente')->orderBy('descricao')->paginate(self::getPageNumber($request));
        }

        if (is_null($projetos)){
            return response()->json([], 204);
        }

        return response()->json($projetos);

    }

    /**
     * @OA\Get(
     *     path="/v1/projeto/{id}",
     *     tags={"Projetos"},
     *     summary="Retorna um projeto via id cadastrado no banco",
     *     description="Retorna um projeto via id cadastrado no banco",
     *     operationId="projeto_show",
     *     security={{"passport": {"*"}}},
     *     @OA\Parameter(
     *         name="id",
     *         in="path",
     *         description="ID do projeto para listar",
     *         required=true,
     *         @OA\Schema(
     *             type="integer",
     *             format="int64"
     *         )
     *     ),
     *     @OA\Response(
     *       @OA\MediaType(mediaType="application/json"),
     *       response=200,
     *       description="Retorna um Projeto"
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
     * @param int $projetoId
     * @return JsonResponse
     */
    public function show(Request $request, int $projetoId)
    {
        try {
            if ($request->cliente === 'true') {
                $projeto = Projeto::with('cliente')->find($projetoId);
            } else {
                $projeto = Projeto::find($projetoId);
            }

            if (is_null($projeto))
                return response()->json(['message' => 'Registro não enconrado.'], 404);

            return response()->json(compact('projeto'));

        } catch (Exception $exception) {
            return response()->json(['message' => self::MESSAGE_HTTP_ERROR_500], 500);
        }
    }

    /**
     * @OA\Post(
     *     path="/v1/projeto",
     *     tags={"Projetos"},
     *     summary="Cadastra um projeto no banco",
     *     description="Exemplo de como cadastrar projeto via API",
     *     operationId="projeto_register",
     *     security={{"passport": {"*"}}},
     *     @OA\RequestBody(
     *         @OA\MediaType(
     *             mediaType="application/json",
     *             @OA\Schema(
     *                 required={
     *                      "descricao",
     *                      "valor",
     *                      "data_inicio",
     *                      "data_fim",
     *                      "local",
     *                      "cliente_id"
     *                 },
     *                 @OA\Property(
     *                     property="descricao",
     *                     type="string"
     *                 ),
     *                  @OA\Property(
     *                     property="valor",
     *                     type="string"
     *                 ),
     *                  @OA\Property(
     *                     property="data_inicio",
     *                     type="string"
     *                 ),
     *                  @OA\Property(
     *                     property="data_fim",
     *                     type="string"
     *                 ),
     *                  @OA\Property(
     *                     property="local",
     *                     type="string"
     *                 ),
     *                  @OA\Property(
     *                     property="cliente_id",
     *                     type="string"
     *                 ),
     *                  @OA\Property(
     *                     property="codigo_projeto",
     *                     type="string"
     *                 ),
     *                 example={
     *                     "descricao": "Projeto 01",
     *                     "valor": "1255.23",
     *                     "data_inicio": "2019-07-22",
     *                     "data_fim": "2020-02-05",
     *                     "local": "Praça da roça, Goiânia",
     *                     "cliente_id": "1",
     *                     "codigo_projeto": "12",
     *                 }
     *             )
     *         )
     *     ),
     *     @OA\Response(
     *         response="200",
     *         description="Projeto cadastrado"
     *     ),
     *     @OA\Response(
     *         response="401",
     *         description="Não autorizado"
     *     ),
     *     @OA\Response(
     *         response="424",
     *         description="Cliente não cadastrado na base dados. "
     *     )
     * )
     * @param Request $request
     * @return JsonResponse
     */
    public function store(Request $request)
    {
        try {
            $inputData = $request->all();
          
            $validator = self::validateInputRequest($inputData);

            if ($validator->fails()) {
                return response()->json(['message' => $validator->errors()], 400);
            }

            if (is_null(Cliente::find($inputData['cliente_id'])))
                return response()->json(['message' => 'O cliente informado não está na base de dados. '], 424);

            $projeto = Projeto::create($inputData);

            return response()->json(compact('projeto'), 201);

        } catch (Exception $exception) {
            return response()->json(['message' => self::MESSAGE_HTTP_ERROR_500], 500);
        }
    }

    /**
     * @OA\Put(
     *     path="/v1/projeto/{id}",
     *     tags={"Projetos"},
     *     summary="Atualiza um projeto no banco",
     *     description="Exemplo de como atualizar um projeto via API",
     *     operationId="projeto_update",
     *     security={{"passport": {"*"}}},
     *     @OA\Parameter(
     *         name="id",
     *         in="path",
     *         description="ID do projeto para atualizar",
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
     *                      "descricao",
     *                      "valor",
     *                      "data_inicio",
     *                      "data_fim",
     *                      "local",
     *                      "cliente_id"
     *                 },
     *                 @OA\Property(
     *                     property="descricao",
     *                     type="string",
     *                 ),
     *                  @OA\Property(
     *                     property="valor",
     *                     type="string"
     *                 ),
     *                  @OA\Property(
     *                     property="data_inicio",
     *                     type="string"
     *                 ),
     *                  @OA\Property(
     *                     property="data_fim",
     *                     type="string"
     *                 ),
     *                  @OA\Property(
     *                     property="local",
     *                     type="string"
     *                 ),
     *                  @OA\Property(
     *                     property="cliente_id",
     *                     type="string"
     *                 ),
     *                  @OA\Property(
     *                     property="codigo_projeto",
     *                     type="string"
     *                 ),
     *                 example={
     *                     "descricao": "Projeto 01",
     *                     "valor": "1255.23",
     *                     "data_inicio": "2019-07-22",
     *                     "data_fim": "2020-02-05",
     *                     "local": "Praça da roça, Goiânia",
     *                     "cliente_id": "1",
     *                     "codigo_projeto": "23",
     *                 }
     *             )
     *         )
     *     ),
     *     @OA\Response(
     *         response="200",
     *         description="successful operation. "
     *     ),
     *     @OA\Response(
     *         response="401",
     *         description="Não autorizado. "
     *     ),
     *     @OA\Response(
     *         response="424",
     *         description="Projeto/Cliente não cadastrado na base dados. "
     *     )
     * )
     * @param Request $request
     * @param int $projetoId
     * @return JsonResponse
     */
    public function update(Request $request, int $projetoId)
    {
        try {

            DB::beginTransaction();

            $projeto = Projeto::find($projetoId);

            if (is_null($projeto)){
                DB::rollBack();
                return response()->json(['message' => __('geral.geral_nao_encontrado')], 404);
            }

            $validacao = $this->validateInputRequest($request->all());

            if ($validacao->fails()) {
                DB::rollBack();
                return response()->json(['message' => $validacao->errors()], 400);
            }

            if(!$projeto->update($request->all())){
                DB::rollBack();
                return response()->json(['message' => __('geral.geral_atualizado_erro')], 400);
            }

            DB::commit();
            return response()->json(['message' => __('geral.geral_atualizado_sucesso')], 200);

        } catch (Exception $exception) {
            return response()->json(['message' => self::MESSAGE_HTTP_ERROR_500], 500);
        }
    }

    /**
     * @OA\Delete(
     *     path="/v1/projeto/{id}",
     *     tags={"Projetos"},
     *     summary="Deleta um projeto via id",
     *     description="Deleta um projeto via id",
     *     operationId="projeto_delete",
     *     security={{"passport": {"*"}}},
     *     @OA\Parameter(
     *         name="id",
     *         in="path",
     *         description="ID do projeto para deletar",
     *         required=true,
     *         @OA\Schema(
     *             type="integer",
     *             format="int64"
     *         )
     *     ),
     *     @OA\Response(
     *       @OA\MediaType(mediaType="application/json"),
     *       response=200,
     *       description="Projeto excluído"
     *     ),
     *     @OA\Response(
     *       @OA\MediaType(mediaType="application/json"),
     *       response="401",
     *       description="Não autorizado. "
     *     ),
     *     @OA\Response(
     *         response="424",
     *         description="Projeto não cadastrado na base dados. "
     *     )
     * )
     * @param int $projetoId
     * @return JsonResponse
     */
    public function destroy(int $projetoId)
    {
        try {
            $projeto = Projeto::find($projetoId);

            if (is_null($projeto))
                return response()->json(['message' => 'Não é possivel excluir o que não foi cadastrado. '], 424);

            $projeto->delete();

            return response()->json([], 204);

        } catch (Exception $exception) {
            return response()->json(['message' => self::MESSAGE_HTTP_ERROR_500], 500);
        }
    }

    /**
     * Search in the model.
     *
     * @OA\GET(
     *     path="/v1/projeto/search",
     *     tags={"Projetos"},
     *     summary="Pesquisa projetos.",
     *     description="Pesquisa projetos.",
     *     operationId="projeto_search",
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
     *         name="filter[descricao]",
     *         in="query",
     *         description="Descrição do projeto a ser pesquisado",
     *         required=false,
     *         @OA\Schema(
     *             type="string",
     *             format="text"
     *         )
     *     ),
     *     @OA\Parameter(
     *         name="filter[local]",
     *         in="query",
     *         description="Local do projeto a ser pesquisado",
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
        $projetos = QueryBuilder::for(Projeto::class)
            ->allowedFilters(['descricao', 'local'])
            ->defaultSort('descricao')
            ->paginate($perPage)
            ->appends($request->query());

        if ( count( $projetos ) == 0){
            return response()->json([], 204);
        }

        return response()->json(compact('projetos'));
    }

    public static function validateInputRequest(array $inputData): ReturnValidator
    {
        return Validator::make($inputData, [
            'descricao' => 'required',
            'valor' => 'required|regex:/^\d+\.\d{2}$/',
            'data_inicio' => 'required|date',
            'data_fim' => 'required|date',
            'local' => 'required|max:255',
            'cliente_id' => 'integer|required',
            'codigo_projeto' => 'integer|nullable'
        ]);
    }
}
