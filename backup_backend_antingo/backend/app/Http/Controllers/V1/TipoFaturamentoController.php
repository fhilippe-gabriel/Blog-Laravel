<?php

namespace App\Http\Controllers\V1;

use App\Http\Controllers\Controller;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Exception;
use Illuminate\Support\Facades\Validator;
use Spatie\QueryBuilder\QueryBuilder;
use Illuminate\Support\Facades\DB;
use App\Models\TipoFaturamento;

class TipoFaturamentoController extends Controller
{
     /**
     * Display a listing of the resource.
     *
     * @OA\Get(
     *   path="/v1/tipos-faturamentos",
     *   summary="Retorna os tipos de faturamentos.",
     *   description="Retorna os tipos de faturamentos que são aceitas pelo sistema.",
     *   tags={"TiposFaturamentos"},
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
     *     description="Lista de tipos de faturamentos"
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
            $tiposFaturamentos = TipoFaturamento::orderBy('descricao')->get();
        } else {
            $tiposFaturamentos = TipoFaturamento::orderBy('descricao')->paginate(self::getPageNumber($request));
        }

        if (is_null($tiposFaturamentos)){
            return response()->json([], 204);
        }

        return response()->json($tiposFaturamentos);
    }

    /**
     * @OA\Post(
     *     path="/v1/tipo-faturamento",
     *     tags={"TiposFaturamentos"},
     *     summary="Cadastra um novo tipo de faturamento.",
     *     description="Cadastra um novo tipo de faturamento.",
     *     operationId="tipo_faturamento_register",
     *     security={{"passport": {"*"}}},
     *     @OA\RequestBody(
     *         @OA\MediaType(
     *             mediaType="application/json",
     *             @OA\Schema(
     *                 required={
     *                      "descricao"
     *                 },
     *                  @OA\Property(
     *                     property="descricao",
     *                     type="string"
     *                 ),
     *                  @OA\Property(
     *                     property="observacao",
     *                     type="string"
     *                 ),
     *                 example={
     *                     "descricao": "Descrição do tipo do faturamento",
     *                     "observacao": "Essa é uma observação do tipo do faturamento",
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
            
            $tipoFaturamento = TipoFaturamento::create($request->all());

            DB::commit();

            return response()->json(compact('tipoFaturamento'), 201);

        } catch (Exception $exception) {
            DB::rollBack();
            return response()->json(['message' => self::MESSAGE_HTTP_ERROR_500], 500);
        }
    }

    /**
     * @OA\Get(
     *     path="/v1/tipo-faturamento/{id}",
     *     tags={"TiposFaturamentos"},
     *     summary="Retorna um tipo de faturamento via id cadastrado no banco de dados",
     *     description="Retorna um tipo de faturamento via id",
     *     operationId="tipo_faturamento_show",
     *     security={{"passport": {"*"}}},
     *     @OA\Parameter(
     *         name="id",
     *         in="path",
     *         description="ID of tipo faturamento to return",
     *         required=true,
     *         @OA\Schema(
     *             type="integer",
     *             format="int64"
     *         )
     *     ),
     *     @OA\Response(
     *       @OA\MediaType(mediaType="application/json"),
     *       response=200,
     *       description="Retorna um tipo de faturamento"
     *     ),
     *     @OA\Response(
     *       @OA\MediaType(mediaType="application/json"),
     *       response="401",
     *       description="Não autorizado. "
     *     ),
     *     @OA\Response(
     *       @OA\MediaType(mediaType="application/json"),
     *       response="404",
     *       description="tipo de faturamento não encontrado"
     *     )
     * )
     * @param int $funcionarioId
     * @return JsonResponse
     */
    public function show(int $tipoFaturamentoId)
    {
        try {
            $tipoFaturamento = TipoFaturamento::find($tipoFaturamentoId);

            if (is_null($tipoFaturamento))
                return response()->json(['message' => __('geral.geral_nao_encontrado')], 404);

            return response()->json(compact('tipoFaturamento'));

        } catch (Exception $exception) {
            return response()->json(['message' => self::MESSAGE_HTTP_ERROR_500], 500);
        }
    }

    /**
     * @OA\Put(
     *     path="/v1/tipo-faturamento/{id}",
     *     tags={"TiposFaturamentos"},
     *     summary="Atualiza um tipo de faturamento.",
     *     description="Atualiza um tipo de faturamento.",
     *     operationId="tipo_faturamento_update",
     *     security={{"passport": {"*"}}},
     *     @OA\Parameter(
     *         name="id",
     *         in="path",
     *         description="ID do tipo de faturamento",
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
     *                      "descricao"
     *                 },
     *                  @OA\Property(
     *                     property="descricao",
     *                     type="string"
     *                 ),
     *                  @OA\Property(
     *                     property="observacao",
     *                     type="string"
     *                 ),
     *                 example={
     *                     "descricao": "Descrição do tipo do faturamento",
     *                     "observacao": "Essa é uma observação do tipo do faturamento",
     *                 }
     *             )
     *         )
     *     ),
     *     @OA\Response(
     *         response="200",
     *         description="Tipo de faturamento atualizado"
     *     ),
     *     @OA\Response(
     *         response="400",
     *         description="Erro ao atualizar"
     *     ),
     *     @OA\Response(
     *         response="404",
     *         description="Tipo de faturamento não encontrado"
     *     ),
     *     @OA\Response(
     *         response="401",
     *         description="Não autorizado"
     *     )
     * )
     * @param Request $request
     * @param int $tipoFaturamentoId
     * @return JsonResponse
     */
    public function update(Request $request, int $tipoFaturamentoId)
    {
        try {
            DB::beginTransaction();

            $tipoFaturamento = TipoFaturamento::find($tipoFaturamentoId);

            if (is_null($tipoFaturamento)){
                DB::rollBack();
                return response()->json(['message' => __('geral.geral_nao_encontrado')], 404);
            }

            $validacao = $this->isValid($this->sanitize($request));

            if ($validacao->fails()) {
                DB::rollBack();
                return response()->json(['message' => $validacao->errors()], 400);
            }

            if(!$tipoFaturamento->update($request->all())){
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
     *     path="/v1/tipo-faturamento/{id}",
     *     tags={"TiposFaturamentos"},
     *     summary="Deleta um tipo de faturamento.",
     *     description="Deleta um tipo de faturamento.",
     *     operationId="tipo_faturamento_delete",
     *     security={{"passport": {"*"}}},
     *     @OA\Parameter(
     *         name="id",
     *         in="path",
     *         description="ID do tipo de faturamento para deletar",
     *         required=true,
     *         @OA\Schema(
     *             type="integer",
     *             format="int64"
     *         )
     *     ),
     *     @OA\Response(
     *       @OA\MediaType(mediaType="application/json"),
     *       response=200,
     *       description="Tipo de faturamento excluído"
     *     ),
     *     @OA\Response(
     *       @OA\MediaType(mediaType="application/json"),
     *       response="401",
     *       description="Não autorizado. "
     *     ),
     *     @OA\Response(
     *         response="404",
     *         description="Tipo de faturamento não cadastrado na base dados. "
     *     )
     * )
     * @param int $tipoFaturamentoId
     * @return JsonResponse
     */
    public function destroy(int $tipoFaturamentoId)
    {
        try {
            DB::beginTransaction();
            $tipoFaturamento = TipoFaturamento::find($tipoFaturamentoId);

            if (is_null($tipoFaturamento)){
                DB::rollBack();
                return response()->json(['message' => __('geral.geral_nao_encontrado')], 404);
            }

            if($tipoFaturamento->delete()){
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
     *     path="/v1/tipo-faturamento/search",
     *     tags={"TiposFaturamentos"},
     *     summary="Pesquisa tipos de faturamentos.",
     *     description="Pesquisa tipos de faturamentos.",
     *     operationId="tipo_faturamento_search",
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
     *         description="Descrição do tipo de faturamento a ser pesquisado",
     *         required=false,
     *         @OA\Schema(
     *             type="string",
     *             format="text"
     *         )
     *     ),
     *     @OA\Parameter(
     *         name="filter[observacao]",
     *         in="query",
     *         description="Observação do tipo de faturamento a ser pesquisado",
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
        $tiposFaturamentos = QueryBuilder::for(TipoFaturamento::class)
            ->allowedFilters(['descricao', 'observacao'])
            ->defaultSort('descricao')
            ->paginate($perPage)
            ->appends($request->query());

        if ( count( $tiposFaturamentos ) == 0){
            return response()->json([], 204);
        }

        return response()->json(compact('tiposFaturamentos'));
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
            'descricao' => 'required',
        ]);
    }
}
