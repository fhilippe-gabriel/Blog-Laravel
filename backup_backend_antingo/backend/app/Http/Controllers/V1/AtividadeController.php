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
use App\Models\Atividade;
use App\Http\Resources\AtividadeResource;
use Spatie\QueryBuilder\AllowedFilter;

class AtividadeController extends Controller
{
    /**
     * Display a listing of the resource.
     *
     * @OA\Get(
     *   path="/v1/atividades",
     *   summary="Retorna as atividades.",
     *   description="Retorna as atividades que são aceitas pelo sistema.",
     *   tags={"Atividades"},
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
            $atividades = Atividade::with(array('projeto'=>function($query){
                $query->select('id', 'descricao');
            }))->orderBy('data_inicio')->get();
        } else {
            $atividades = Atividade::with(array('projeto'=>function($query){
                $query->select('id', 'descricao');
            }))->orderBy('data_inicio')->paginate(self::getPageNumber($request));
        }

        if (is_null($atividades)){
            return response()->json([], 204);
        }

        return response()->json($atividades);
    }

    /**
     * @OA\Post(
     *     path="/v1/atividade",
     *     tags={"Atividades"},
     *     summary="Cadastra uma nova atividade.",
     *     description="Cadastra uma nova atividade.",
     *     operationId="atividade_register",
     *     security={{"passport": {"*"}}},
     *     @OA\RequestBody(
     *         @OA\MediaType(
     *             mediaType="application/json",
     *             @OA\Schema(
     *                 required={
     *                      "numero",
     *                      "descricao",
     *                      "data_inicio",
     *                      "data_termino",
     *                      "quantidade_dias",
     *                      "horas_previstas",
     *                      "horas_realizadas",
     *                      "responsavel_id",
     *                      "projeto_id",
     *                      "tipo_atividade_id",
     *                      "tipo_faturamento_id"
     *                 },
     *                 @OA\Property(
     *                     property="numero",
     *                     type="integer"
     *                 ),
     *                 @OA\Property(
     *                     property="descricao",
     *                     type="string"
     *                 ),
     *                 @OA\Property(
     *                     property="data_inicio",
     *                     type="date"
     *                 ),
     *                 @OA\Property(
     *                     property="data_termino",
     *                     type="date"
     *                 ),
     *                 @OA\Property(
     *                     property="quantidade_dias",
     *                     type="integer"
     *                 ),
     *                 @OA\Property(
     *                     property="horas_previstas",
     *                     type="integer"
     *                 ),
     *                 @OA\Property(
     *                     property="horas_realizadas",
     *                     type="integer"
     *                 ),
     *                  @OA\Property(
     *                     property="responsavel_id",
     *                     type="integer"
     *                 ),
     *                  @OA\Property(
     *                     property="projeto_id",
     *                     type="integer"
     *                 ),
     *                  @OA\Property(
     *                     property="tarifa_id",
     *                     type="integer"
     *                 ),
     *                  @OA\Property(
     *                     property="tipo_atividade_id",
     *                     type="integer"
     *                 ),
     *                  @OA\Property(
     *                     property="tipo_faturamento_id",
     *                     type="integer"
     *                 ),
     *                  @OA\Property(
     *                     property="observacao",
     *                     type="string"
     *                 ),
     *                 example={
     *                     "numero": "52123",
     *                     "descricao": "Descrição da atividade",
     *                     "data_inicio": "2020-08-01",
     *                     "data_termino": "2020-08-20",
     *                     "quantidade_dias": "19",
     *                     "horas_previstas": "152",
     *                     "horas_realizadas": "144",
     *                     "responsavel_id": "3",
     *                     "projeto_id": "2",
     *                     "tarifa_id": "4",
     *                     "tipo_atividade_id": "2",
     *                     "tipo_faturamento_id": "1",
     *                     "observacao": "Essa é uma observação da atividade",
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
            
            $atividade = Atividade::create($request->all());

            DB::commit();

            return response()->json(compact('atividade'), 201);

        } catch (Exception $exception) {
            DB::rollBack();
            return response()->json(['message' => self::MESSAGE_HTTP_ERROR_500], 500);
        }
    }

    /**
     * @OA\Get(
     *     path="/v1/atividade/{id}",
     *     tags={"Atividades"},
     *     summary="Retorna uma atividade via id cadastrado no banco de dados",
     *     description="Retorna uma atividade via id",
     *     operationId="atividade_show",
     *     security={{"passport": {"*"}}},
     *     @OA\Parameter(
     *         name="id",
     *         in="path",
     *         description="ID of atividade to return",
     *         required=true,
     *         @OA\Schema(
     *             type="integer",
     *             format="int64"
     *         )
     *     ),
     *     @OA\Response(
     *       @OA\MediaType(mediaType="application/json"),
     *       response=200,
     *       description="Retorna uma atividade"
     *     ),
     *     @OA\Response(
     *       @OA\MediaType(mediaType="application/json"),
     *       response="401",
     *       description="Não autorizado. "
     *     ),
     *     @OA\Response(
     *       @OA\MediaType(mediaType="application/json"),
     *       response="404",
     *       description="Atividade não encontrada"
     *     )
     * )
     * @param int $funcionarioId
     * @return JsonResponse
     */
    public function show(int $atividadeId)
    {
        try {
            $atividade = Atividade::find($atividadeId);

            if (is_null($atividade))
                return response()->json(['message' => __('geral.geral_nao_encontrado')], 404);
                
            return response()->json(compact('atividade'));
            // return new AtividadeResource($atividade);

        } catch (Exception $exception) {
            return response()->json(['message' => self::MESSAGE_HTTP_ERROR_500], 500);
        }
    }

    /**
     * @OA\Put(
     *     path="/v1/atividade/{id}",
     *     tags={"Atividades"},
     *     summary="Atualiza uma atividade.",
     *     description="Atualiza uma atividade.",
     *     operationId="atividade_update",
     *     security={{"passport": {"*"}}},
     *     @OA\Parameter(
     *         name="id",
     *         in="path",
     *         description="ID da atividade",
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
     *                      "numero",
     *                      "descricao",
     *                      "data_inicio",
     *                      "data_termino",
     *                      "quantidade_dias",
     *                      "horas_previstas",
     *                      "horas_realizadas",
     *                      "responsavel_id",
     *                      "projeto_id",
     *                      "tipo_atividade_id",
     *                      "tipo_faturamento_id"
     *                 },
     *                 @OA\Property(
     *                     property="numero",
     *                     type="integer"
     *                 ),
     *                 @OA\Property(
     *                     property="descricao",
     *                     type="string"
     *                 ),
     *                 @OA\Property(
     *                     property="data_inicio",
     *                     type="date"
     *                 ),
     *                 @OA\Property(
     *                     property="data_termino",
     *                     type="date"
     *                 ),
     *                 @OA\Property(
     *                     property="quantidade_dias",
     *                     type="integer"
     *                 ),
     *                 @OA\Property(
     *                     property="horas_previstas",
     *                     type="integer"
     *                 ),
     *                 @OA\Property(
     *                     property="horas_realizadas",
     *                     type="integer"
     *                 ),
     *                  @OA\Property(
     *                     property="responsavel_id",
     *                     type="integer"
     *                 ),
     *                  @OA\Property(
     *                     property="projeto_id",
     *                     type="integer"
     *                 ),
     *                  @OA\Property(
     *                     property="tarifa_id",
     *                     type="integer"
     *                 ),
     *                  @OA\Property(
     *                     property="tipo_atividade_id",
     *                     type="integer"
     *                 ),
     *                  @OA\Property(
     *                     property="tipo_faturamento_id",
     *                     type="integer"
     *                 ),
     *                  @OA\Property(
     *                     property="observacao",
     *                     type="string"
     *                 ),
     *                 example={
     *                     "numero": "534123",
     *                     "descricao": "Descrição da atualização da atividade",
     *                     "data_inicio": "2020-08-02",
     *                     "data_termino": "2020-08-15",
     *                     "quantidade_dias": "13",
     *                     "horas_previstas": "132",
     *                     "horas_realizadas": "124",
     *                     "responsavel_id": "2",
     *                     "projeto_id": "3",
     *                     "tarifa_id": "5",
     *                     "tipo_atividade_id": "1",
     *                     "tipo_faturamento_id": "2",
     *                     "observacao": "Essa é uma observação da atualização da atividade",
     *                 }
     *             )
     *         )
     *     ),
     *     @OA\Response(
     *         response="200",
     *         description="Atividade atualizada"
     *     ),
     *     @OA\Response(
     *         response="400",
     *         description="Erro ao atualizar"
     *     ),
     *     @OA\Response(
     *         response="404",
     *         description="Atividade não encontrada"
     *     ),
     *     @OA\Response(
     *         response="401",
     *         description="Não autorizado"
     *     )
     * )
     * @param Request $request
     * @param int $atividadeId
     * @return JsonResponse
     */
    public function update(Request $request, int $atividadeId)
    {
        try {
            DB::beginTransaction();

            $atividade = Atividade::find($atividadeId);

            if (is_null($atividade)){
                DB::rollBack();
                return response()->json(['message' => __('geral.geral_nao_encontrado')], 404);
            }

            $validacao = $this->isValid($this->sanitize($request));

            if ($validacao->fails()) {
                DB::rollBack();
                return response()->json(['message' => $validacao->errors()], 400);
            }

            if(!$atividade->update($request->all())){
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
     *     path="/v1/atividade/{id}",
     *     tags={"Atividades"},
     *     summary="Deleta uma atividade.",
     *     description="Deleta uma atividade.",
     *     operationId="atividade_delete",
     *     security={{"passport": {"*"}}},
     *     @OA\Parameter(
     *         name="id",
     *         in="path",
     *         description="ID da atividade para deletar",
     *         required=true,
     *         @OA\Schema(
     *             type="integer",
     *             format="int64"
     *         )
     *     ),
     *     @OA\Response(
     *       @OA\MediaType(mediaType="application/json"),
     *       response=200,
     *       description="Atividade excluída"
     *     ),
     *     @OA\Response(
     *       @OA\MediaType(mediaType="application/json"),
     *       response="401",
     *       description="Não autorizado. "
     *     ),
     *     @OA\Response(
     *         response="404",
     *         description="Atividade não cadastrada na base dados. "
     *     )
     * )
     * @param int $atividadeId
     * @return JsonResponse
     */
    public function destroy(int $atividadeId)
    {
        try {
            DB::beginTransaction();
            $atividade = Atividade::find($atividadeId);

            if (is_null($atividade)){
                DB::rollBack();
                return response()->json(['message' => __('geral.geral_nao_encontrado')], 404);
            }

            if($atividade->delete()){
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
     *     path="/v1/atividade/search",
     *     tags={"Atividades"},
     *     summary="Pesquisa atividades.",
     *     description="Pesquisa atividades.",
     *     operationId="atividade_search",
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
     *         description="Descrição da atividade a ser pesquisado",
     *         required=false,
     *         @OA\Schema(
     *             type="string",
     *             format="text"
     *         )
     *     ),
     *     @OA\Parameter(
     *         name="filter[quantidade_dias]",
     *         in="query",
     *         description="Quantidade de dias da atividade a ser pesquisado",
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
        $atividades = QueryBuilder::for(Atividade::class)
            ->allowedFilters(['descricao', AllowedFilter::exact('quantidade_dias')])
            ->defaultSort('data_inicio')
            ->paginate($perPage)
            ->appends($request->query());

        if ( count( $atividades ) == 0){
            return response()->json([], 204);
        }

        return response()->json(compact('atividades'));
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
            'numero' => [
                'required', 
                'string',
                Rule::unique('atividades')->ignore($request->id),
            ],
            'descricao' => 'required|string',
            'data_inicio' => 'required|string',
            'data_termino' => 'required|string',
            'quantidade_dias' => 'required',
            'horas_previstas' => 'required',
            'horas_realizadas' => 'required',
            'responsavel_id' => 'required|integer|exists:funcionarios,id',
            'projeto_id' => 'required|integer|exists:projetos,id',
            'tarifa_id' => 'required|integer|exists:tarifas,id',
            'tipo_atividade_id' => 'required|integer|exists:tipos_atividades,id',
            'tipo_faturamento_id' => 'required|integer|exists:tipos_faturamentos,id',
        ]);
    }
}
