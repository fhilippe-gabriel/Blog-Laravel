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
use App\Models\TarifaPreco;
use App\Http\Resources\TarifaPrecoResource;

class TarifaPrecoController extends Controller
{
    /**
     * Display a listing of the resource.
     *
     * @OA\Get(
     *   path="/v1/tarifas-precos",
     *   summary="Retorna os preços das tarifas.",
     *   description="Retorna os preços das tarifas que são aceitas pelo sistema.",
     *   tags={"TarifasPrecos"},
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
     *     description="Lista de preços das tarifas"
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
            $tarifasPrecos = TarifaPreco::with(array('tiposRecursos'=>function($query){
                $query->select('id', 'descricao');
            }))->with(array('tarifas'=>function($query){
                $query->select('id', 'descricao');
            }))->get();
        } else {
            $tarifasPrecos = TarifaPreco::with(array('tiposRecursos'=>function($query){
                $query->select('id', 'descricao');
            }))->with(array('tarifas'=>function($query){
                $query->select('id', 'descricao');
            }))->paginate(self::getPageNumber($request));
        }

        if (is_null($tarifasPrecos)){
            return response()->json([], 204);
        }

        return response()->json($tarifasPrecos);
    }

    /**
     * @OA\Post(
     *     path="/v1/tarifa-preco",
     *     tags={"TarifasPrecos"},
     *     summary="Cadastra um novo preço da tarifa.",
     *     description="Cadastra um novo preço da tarifa.",
     *     operationId="tarifa_preco_register",
     *     security={{"passport": {"*"}}},
     *     @OA\RequestBody(
     *         @OA\MediaType(
     *             mediaType="application/json",
     *             @OA\Schema(
     *                 required={
     *                      "valor",
     *                      "tarifa_id",
     *                      "tipo_recurso_id"
     *                 },
     *                 @OA\Property(
     *                     property="valor",
     *                     type="float"
     *                 ),
     *                  @OA\Property(
     *                     property="tarifa_id",
     *                     type="integer"
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
     *                     "valor": "17.2",
     *                     "tarifa_id": "1",
     *                     "tipo_recurso_id": "1",
     *                     "observacao": "Essa é uma observação do preço da tarifa",
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
            
            $tarifaPreco = TarifaPreco::create($request->all());

            DB::commit();

            return response()->json(compact('tarifaPreco'), 201);

        } catch (Exception $exception) {
            DB::rollBack();
            return response()->json(['message' => self::MESSAGE_HTTP_ERROR_500], 500);
        }
    }

    /**
     * @OA\Get(
     *     path="/v1/tarifa-preco/{id}",
     *     tags={"TarifasPrecos"},
     *     summary="Retorna um preço da tarifa via id cadastrado no banco de dados",
     *     description="Retorna um preço da tarifa via id",
     *     operationId="tarifa_preco_show",
     *     security={{"passport": {"*"}}},
     *     @OA\Parameter(
     *         name="id",
     *         in="path",
     *         description="ID of tarifa preco to return",
     *         required=true,
     *         @OA\Schema(
     *             type="integer",
     *             format="int64"
     *         )
     *     ),
     *     @OA\Response(
     *       @OA\MediaType(mediaType="application/json"),
     *       response=200,
     *       description="Retorna um preço da tarifa"
     *     ),
     *     @OA\Response(
     *       @OA\MediaType(mediaType="application/json"),
     *       response="401",
     *       description="Não autorizado. "
     *     ),
     *     @OA\Response(
     *       @OA\MediaType(mediaType="application/json"),
     *       response="404",
     *       description="Preço da tarifa não encontrado"
     *     )
     * )
     * @param int $funcionarioId
     * @return JsonResponse
     */
    public function show(int $tarifaPrecoId)
    {
        try {
            // $tarifaPreco = TarifaPreco::with('tarifas')->find($tarifaPrecoId);

            $tarifaPreco = TarifaPreco::with(array('tiposRecursos'=>function($query){
                $query->select('id', 'descricao');
            }))->with(array('tarifas'=>function($query){
                $query->select('id', 'descricao');
            }))->find($tarifaPrecoId);

            if (is_null($tarifaPreco))
                return response()->json(['message' => __('geral.geral_nao_encontrado')], 404);

            // return new TarifaPrecoResource($tarifaPreco);
            return response()->json(compact('tarifaPreco'));

        } catch (Exception $exception) {
            return response()->json(['message' => self::MESSAGE_HTTP_ERROR_500], 500);
        }
    }

    /**
     * @OA\Put(
     *     path="/v1/tarifa-preco/{id}",
     *     tags={"TarifasPrecos"},
     *     summary="Atualiza um preço da tarifa.",
     *     description="Atualiza um preço da tarifa.",
     *     operationId="tarifa_preco_update",
     *     security={{"passport": {"*"}}},
     *     @OA\Parameter(
     *         name="id",
     *         in="path",
     *         description="ID do preço da tarifa",
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
     *                      "valor",
     *                      "tarifa_id",
     *                      "tipo_recurso_id"
     *                 },
     *                 @OA\Property(
     *                     property="valor",
     *                     type="float"
     *                 ),
     *                  @OA\Property(
     *                     property="tarifa_id",
     *                     type="integer"
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
     *                     "valor": "11.9",
     *                     "tarifa_id": "2",
     *                     "tipo_recurso_id": "2",
     *                     "observacao": "Essa é uma observação do preço da tarifa",
     *                 }
     *             )
     *         )
     *     ),
     *     @OA\Response(
     *         response="200",
     *         description="Preço da tarifa atualizado"
     *     ),
     *     @OA\Response(
     *         response="400",
     *         description="Erro ao atualizar"
     *     ),
     *     @OA\Response(
     *         response="404",
     *         description="Preço da tarifa não encontrado"
     *     ),
     *     @OA\Response(
     *         response="401",
     *         description="Não autorizado"
     *     )
     * )
     * @param Request $request
     * @param int $tarifaPrecoId
     * @return JsonResponse
     */
    public function update(Request $request, int $tarifaPrecoId)
    {
        try {
            DB::beginTransaction();

            $tarifaPreco = TarifaPreco::find($tarifaPrecoId);

            if (is_null($tarifaPreco)){
                DB::rollBack();
                return response()->json(['message' => __('geral.geral_nao_encontrado')], 404);
            }

            $validacao = $this->isValid($this->sanitize($request));

            if ($validacao->fails()) {
                DB::rollBack();
                return response()->json(['message' => $validacao->errors()], 400);
            }

            if(!$tarifaPreco->update($request->all())){
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
     *     path="/v1/tarifa-preco/{id}",
     *     tags={"TarifasPrecos"},
     *     summary="Deleta um preço da tarifa.",
     *     description="Deleta um preço da tarifa.",
     *     operationId="tarifa_preco_delete",
     *     security={{"passport": {"*"}}},
     *     @OA\Parameter(
     *         name="id",
     *         in="path",
     *         description="ID do preço da tarifa para deletar",
     *         required=true,
     *         @OA\Schema(
     *             type="integer",
     *             format="int64"
     *         )
     *     ),
     *     @OA\Response(
     *       @OA\MediaType(mediaType="application/json"),
     *       response=200,
     *       description="Preço da tarifa excluído"
     *     ),
     *     @OA\Response(
     *       @OA\MediaType(mediaType="application/json"),
     *       response="401",
     *       description="Não autorizado. "
     *     ),
     *     @OA\Response(
     *         response="404",
     *         description="Preço não cadastrado na base dados. "
     *     )
     * )
     * @param int $tarifaPrecoId
     * @return JsonResponse
     */
    public function destroy(int $tarifaPrecoId)
    {
        try {
            DB::beginTransaction();
            $tarifaPreco = TarifaPreco::find($tarifaPrecoId);

            if (is_null($tarifaPreco)){
                DB::rollBack();
                return response()->json(['message' => __('geral.geral_nao_encontrado')], 404);
            }

            if($tarifaPreco->delete()){
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
            'valor' => 'required|numeric',
            'tarifa_id' => 'required|integer|exists:tarifas,id',
            'tipo_recurso_id' => 'required|integer|exists:tipos_recursos,id',
        ]);
    }
}
