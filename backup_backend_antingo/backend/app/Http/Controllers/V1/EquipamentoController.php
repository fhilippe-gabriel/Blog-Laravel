<?php

namespace App\Http\Controllers\V1;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use Exception;
use Illuminate\Support\Facades\Validator;
use Spatie\QueryBuilder\QueryBuilder;
use Illuminate\Support\Facades\DB;
use Illuminate\Validation\Rule;
use App\Models\Equipamento;
use App\Http\Resources\EquipamentoResource;

class EquipamentoController extends Controller
{
    /**
     * Display a listing of the resource.
     *
     * @OA\Get(
     *   path="/v1/equipamentos",
     *   summary="Retorna os equipamentos.",
     *   description="Retorna os equipamentos que são aceitas pelo sistema.",
     *   tags={"Equipamentos"},
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
     *     description="Lista de equipamentos"
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
            $equipamentos = Equipamento::orderBy('nome_recurso')->get();
        } else {
            $equipamentos = Equipamento::orderBy('nome_recurso')->paginate(self::getPageNumber($request));
        }

        if (is_null($equipamentos)){
            return response()->json([], 204);
        }

        return response()->json($equipamentos);
    }

    /**
     * @OA\Post(
     *     path="/v1/equipamento",
     *     tags={"Equipamentos"},
     *     summary="Cadastra um novo equipamento.",
     *     description="Cadastra um novo equipamento.",
     *     operationId="equipamento_register",
     *     security={{"passport": {"*"}}},
     *     @OA\RequestBody(
     *         @OA\MediaType(
     *             mediaType="application/json",
     *             @OA\Schema(
     *                 required={
     *                      "nome_recurso",
     *                      "tipo_recurso_id"
     *                 },
     *                  @OA\Property(
     *                     property="nome_recurso",
     *                     type="string"
     *                 ),
     *                  @OA\Property(
     *                     property="tipo_recurso_id",
     *                     type="integer"
     *                 ),
     *                  @OA\Property(
     *                     property="observacao",
     *                     type="string"
     *                 ),
     *                 example={
     *                     "nome_recurso": "Nome do recurso",
     *                     "tipo_recurso_id": "1",
     *                     "observacao": "Essa é uma observação do equipamento",
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
            DB::beginTransaction();
            $validacao = $this->isValid($this->sanitize($request));

            if ($validacao->fails()) {
                DB::rollBack();
                return response()->json(['message' => $validacao->errors()], 400);
            }
            
            $equipamento = Equipamento::create($request->all());

            DB::commit();

            return response()->json(compact('equipamento'), 201);

        } catch (Exception $exception) {
            DB::rollBack();
            return response()->json(['message' => self::MESSAGE_HTTP_ERROR_500], 500);
        }
    }

    /**
     * @OA\Get(
     *     path="/v1/equipamento/{id}",
     *     tags={"Equipamentos"},
     *     summary="Retorna um equipamento via id cadastrado no banco de dados",
     *     description="Retorna um equipamento via id",
     *     operationId="equipamento_show",
     *     security={{"passport": {"*"}}},
     *     @OA\Parameter(
     *         name="id",
     *         in="path",
     *         description="ID of equipamento to return",
     *         required=true,
     *         @OA\Schema(
     *             type="integer",
     *             format="int64"
     *         )
     *     ),
     *     @OA\Response(
     *       @OA\MediaType(mediaType="application/json"),
     *       response=200,
     *       description="Retorna um equipamento"
     *     ),
     *     @OA\Response(
     *       @OA\MediaType(mediaType="application/json"),
     *       response="401",
     *       description="Não autorizado. "
     *     ),
     *     @OA\Response(
     *       @OA\MediaType(mediaType="application/json"),
     *       response="404",
     *       description="Equipamento não encontrado"
     *     )
     * )
     * @param int $funcionarioId
     * @return JsonResponse
     */
    public function show(int $equipamentoId)
    {
        try {
            $equipamento = Equipamento::with('tiposRecursos')->find($equipamentoId);

            if (is_null($equipamento))
                return response()->json(['message' => __('geral.geral_nao_encontrado')], 404);

            // return new EquipamentoResource($equipamento);
            return response()->json(compact('equipamento'));

        } catch (Exception $exception) {
            return response()->json(['message' => self::MESSAGE_HTTP_ERROR_500], 500);
        }
    }

    /**
     * @OA\Put(
     *     path="/v1/equipamento/{id}",
     *     tags={"Equipamentos"},
     *     summary="Atualiza um equipamento.",
     *     description="Atualiza um equipamento.",
     *     operationId="equipamento_update",
     *     security={{"passport": {"*"}}},
     *     @OA\Parameter(
     *         name="id",
     *         in="path",
     *         description="ID do equipamento",
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
     *                      "nome_recurso",
     *                      "tipo_recurso_id"
     *                 },
     *                  @OA\Property(
     *                     property="nome_recurso",
     *                     type="string"
     *                 ),
     *                 @OA\Property(
     *                     property="tipo_recurso_id",
     *                     type="integer"
     *                 ),
     *                  @OA\Property(
     *                     property="observacao",
     *                     type="string"
     *                 ),
     *                 example={
     *                     "nome_recurso": "Nome do equipamento",
     *                     "tipo_recurso_id": "1",
     *                     "observacao": "Essa é uma observação do equipamento",
     *                 }
     *             )
     *         )
     *     ),
     *     @OA\Response(
     *         response="200",
     *         description="Equipamento atualizado"
     *     ),
     *     @OA\Response(
     *         response="400",
     *         description="Erro ao atualizar"
     *     ),
     *     @OA\Response(
     *         response="404",
     *         description="Equipamento não encontrado"
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
    public function update(Request $request, int $equipamentoId)
    {
        try {
            DB::beginTransaction();

            $equipamento = Equipamento::find($equipamentoId);

            if (is_null($equipamento)){
                DB::rollBack();
                return response()->json(['message' => __('geral.geral_nao_encontrado')], 404);
            }

            $validacao = $this->isValid($this->sanitize($request));

            if ($validacao->fails()) {
                DB::rollBack();
                return response()->json(['message' => $validacao->errors()], 400);
            }

            if(!$equipamento->update($request->all())){
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
     * Remove the specified resource from storage.
     *
     * @OA\Delete(
     *     path="/v1/equipamento/{id}",
     *     tags={"Equipamentos"},
     *     summary="Deleta um equipamento.",
     *     description="Deleta um equipamento.",
     *     operationId="equipamento_delete",
     *     security={{"passport": {"*"}}},
     *     @OA\Parameter(
     *         name="id",
     *         in="path",
     *         description="ID do equipamento para deletar",
     *         required=true,
     *         @OA\Schema(
     *             type="integer",
     *             format="int64"
     *         )
     *     ),
     *     @OA\Response(
     *       @OA\MediaType(mediaType="application/json"),
     *       response=200,
     *       description="Equipamento excluído"
     *     ),
     *     @OA\Response(
     *       @OA\MediaType(mediaType="application/json"),
     *       response="401",
     *       description="Não autorizado. "
     *     ),
     *     @OA\Response(
     *         response="404",
     *         description="Equipamento não cadastrado na base dados. "
     *     )
     * )
     * @param int $equipamentoId
     * @return JsonResponse
     */
    public function destroy(int $equipamentoId)
    {
        try {
            DB::beginTransaction();
            $equipamento = Equipamento::find($equipamentoId);

            if (is_null($equipamento)){
                DB::rollBack();
                return response()->json(['message' => __('geral.geral_nao_encontrado')], 404);
            }

            if($equipamento->delete()){
                DB::commit();
                return response()->json(['message' => __('geral.geral_excluido_sucesso')], 200);
            }
            DB::rollBack();
            return response()->json([], 204);

        } catch (Exception $exception) {
            return response()->json(['message' => self::MESSAGE_HTTP_ERROR_500], 500);
        }
    }

    /**
     * Search in the model.
     *
     * @OA\GET(
     *     path="/v1/equipamento/search",
     *     tags={"Equipamentos"},
     *     summary="Pesquisa equipamentos.",
     *     description="Pesquisa equipamentos.",
     *     operationId="equipamento_search",
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
     *         name="filter[nome_recurso]",
     *         in="query",
     *         description="Nome do recurso a ser pesquisado",
     *         required=false,
     *         @OA\Schema(
     *             type="string",
     *             format="text"
     *         )
     *     ),
     *     @OA\Parameter(
     *         name="filter[tiposRecursos.descricao]",
     *         in="query",
     *         description="Nome do recurso a ser pesquisado",
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
        $equipamentos = QueryBuilder::for(Equipamento::class)
            ->allowedFilters(['nome_recurso', 'tiposRecursos.descricao'])
            ->allowedIncludes('tiposRecursos')
            ->defaultSort('nome_recurso')
            ->paginate($perPage)
            ->appends($request->query());

        if ( count( $equipamentos ) == 0){
            return response()->json([], 204);
        }

        return response()->json(compact('equipamentos'));
    }

    /**
     * Sanitize fields
     * @param Request $request
     * @throws Request
     */
    private function sanitize(Request $request)
    {
        $input = $request->all();

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
            'nome_recurso' => 'required',
            'tipo_recurso_id' => 'required|integer|exists:tipos_recursos,id',
        ]);
    }
}
