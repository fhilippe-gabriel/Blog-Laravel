<?php

namespace App\Http\Controllers\V1;

use App\Models\Tarifa;
use App\Http\Controllers\Controller;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Exception;
use Illuminate\Support\Facades\Validator;
use Spatie\QueryBuilder\QueryBuilder;
use Illuminate\Support\Facades\DB;

class TarifaController extends Controller
{
    /**
     * Display a listing of the resource.
     *
     * @OA\Get(
     *   path="/v1/tarifas",
     *   summary="Retorna as tarifas.",
     *   description="Retorna as tarifas que são aceitas pelo sistema.",
     *   tags={"Tarifas"},
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
     *     description="Lista de tarifas"
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
            $tarifas = Tarifa::orderBy('descricao')->get();
        } else {
            $tarifas = Tarifa::orderBy('descricao')->paginate(self::getPageNumber($request));
        }

        if (is_null($tarifas)){
            return response()->json([], 204);
        }

        return response()->json($tarifas);
    }

    /**
     * @OA\Post(
     *     path="/v1/tarifa",
     *     tags={"Tarifas"},
     *     summary="Cadastra uma nova tarifa.",
     *     description="Cadastra um nova tarifa.",
     *     operationId="tarifa_register",
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
     *                 example={
     *                     "descricao": "Descrição da tarifa",
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
            
            $tarifa = Tarifa::create($request->all());

            DB::commit();

            return response()->json(compact('tarifa'), 201);

        } catch (Exception $exception) {
            DB::rollBack();
            return response()->json(['message' => self::MESSAGE_HTTP_ERROR_500], 500);
        }
    }

    /**
     * @OA\Get(
     *     path="/v1/tarifa/{id}",
     *     tags={"Tarifas"},
     *     summary="Retorna uma tarifa via id cadastrado no banco de dados",
     *     description="Retorna uma tarifa via id",
     *     operationId="tarifa_show",
     *     security={{"passport": {"*"}}},
     *     @OA\Parameter(
     *         name="id",
     *         in="path",
     *         description="ID da tarifa",
     *         required=true,
     *         @OA\Schema(
     *             type="integer",
     *             format="int64"
     *         )
     *     ),
     *     @OA\Response(
     *       @OA\MediaType(mediaType="application/json"),
     *       response=200,
     *       description="Retorna uma tarifa"
     *     ),
     *     @OA\Response(
     *       @OA\MediaType(mediaType="application/json"),
     *       response="401",
     *       description="Não autorizado. "
     *     ),
     *     @OA\Response(
     *       @OA\MediaType(mediaType="application/json"),
     *       response="404",
     *       description="Tarifa não encontrada"
     *     )
     * )
     * @param int $funcionarioId
     * @return JsonResponse
     */
    public function show(int $tarifaId)
    {
        try {
            $tarifa = Tarifa::find($tarifaId);

            if (is_null($tarifa))
                return response()->json(['message' => __('geral.geral_nao_encontrado')], 404);

            return response()->json(compact('tarifa'));

        } catch (Exception $exception) {
            return response()->json(['message' => self::MESSAGE_HTTP_ERROR_500], 500);
        }
    }

    /**
     * @OA\Put(
     *     path="/v1/tarifa/{id}",
     *     tags={"Tarifas"},
     *     summary="Atualiza uma tarifa.",
     *     description="Atualiza uma tarifa.",
     *     operationId="tarifa_update",
     *     security={{"passport": {"*"}}},
     *     @OA\Parameter(
     *         name="id",
     *         in="path",
     *         description="ID da tarifa",
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
     *                 example={
     *                     "descricao": "Descrição da tarifa",
     *                 }
     *             )
     *         )
     *     ),
     *     @OA\Response(
     *         response="200",
     *         description="Tarifa atualizada"
     *     ),
     *     @OA\Response(
     *         response="400",
     *         description="Erro ao atualizar"
     *     ),
     *     @OA\Response(
     *         response="404",
     *         description="Tarifa não encontrada"
     *     ),
     *     @OA\Response(
     *         response="401",
     *         description="Não autorizado"
     *     )
     * )
     * @param Request $request
     * @param int $tarifaId
     * @return JsonResponse
     */
    public function update(Request $request, int $tarifaId)
    {
        try {
            DB::beginTransaction();

            $tarifa = Tarifa::find($tarifaId);

            if (is_null($tarifa)){
                DB::rollBack();
                return response()->json(['message' => __('geral.geral_nao_encontrado')], 404);
            }

            $validacao = $this->isValid($this->sanitize($request));

            if ($validacao->fails()) {
                DB::rollBack();
                return response()->json(['message' => $validacao->errors()], 400);
            }

            if(!$tarifa->update($request->all())){
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
     *     path="/v1/tarifa/{id}",
     *     tags={"Tarifas"},
     *     summary="Deleta uma tarifa.",
     *     description="Deleta uma tarifa.",
     *     operationId="tarifa_delete",
     *     security={{"passport": {"*"}}},
     *     @OA\Parameter(
     *         name="id",
     *         in="path",
     *         description="ID da tarifa para deletar",
     *         required=true,
     *         @OA\Schema(
     *             type="integer",
     *             format="int64"
     *         )
     *     ),
     *     @OA\Response(
     *       @OA\MediaType(mediaType="application/json"),
     *       response=200,
     *       description="Tarifa excluída"
     *     ),
     *     @OA\Response(
     *       @OA\MediaType(mediaType="application/json"),
     *       response="401",
     *       description="Não autorizado. "
     *     ),
     *     @OA\Response(
     *         response="404",
     *         description="Tarifa não cadastrada na base dados. "
     *     )
     * )
     * @param int $tarifaId
     * @return JsonResponse
     */
    public function destroy(int $tarifaId)
    {
        try {
            DB::beginTransaction();
            $tarifa = Tarifa::find($tarifaId);

            if (is_null($tarifa)){
                DB::rollBack();
                return response()->json(['message' => __('geral.geral_nao_encontrado')], 404);
            }

            if($tarifa->delete()){
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
     *     path="/v1/tarifa/search",
     *     tags={"Tarifas"},
     *     summary="Pesquisa tarifas.",
     *     description="Pesquisa tarifas.",
     *     operationId="tarifa_search",
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
     *         description="Descrição da tarifa a ser pesquisado",
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
        $tarifas = QueryBuilder::for(Tarifa::class)
            ->allowedFilters(['descricao'])
            ->defaultSort('descricao')
            ->paginate($perPage)
            ->appends($request->query());

        if ( count( $tarifas ) == 0){
            return response()->json([], 204);
        }

        return response()->json(compact('tarifas'));
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
