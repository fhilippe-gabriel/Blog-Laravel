<?php

namespace App\Http\Controllers\V1;

use App\Models\TipoAtividade;
use App\Http\Controllers\Controller;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Exception;
use Illuminate\Support\Facades\Validator;
use Spatie\QueryBuilder\QueryBuilder;
use Illuminate\Support\Facades\DB;
use Illuminate\Validation\Rule;

class TipoAtividadeController extends Controller
{
    /**
     * Display a listing of the resource.
     *
     * @OA\Get(
     *   path="/v1/tipos-atividades",
     *   summary="Retorna os tipos de atividades.",
     *   description="Retorna os tipos de atividades que são aceitas pelo sistema.",
     *   tags={"TiposAtividades"},
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
     *     description="Lista de tipos de atividades"
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
            $tipoAtividade = TipoAtividade::orderBy('descricao')->get();
        } else {
            $tipoAtividade = TipoAtividade::orderBy('descricao')->paginate(self::getPageNumber($request));
        }

        if (is_null($tipoAtividade)){
            return response()->json([], 204);
        }

        return response()->json($tipoAtividade);
    }

    /**
     * @OA\Post(
     *     path="/v1/tipo-atividade",
     *     tags={"TiposAtividades"},
     *     summary="Cadastra um novo tipo de atividade.",
     *     description="Cadastra um novo tipo de atividade.",
     *     operationId="tipo_atividade_register",
     *     security={{"passport": {"*"}}},
     *     @OA\RequestBody(
     *         @OA\MediaType(
     *             mediaType="application/json",
     *             @OA\Schema(
     *                 required={
     *                      "numero",
     *                      "descricao",
     *                      "deletavel",
     *                 },
     *                 @OA\Property(
     *                     property="numero",
     *                     type="integer"
     *                 ),
     *                  @OA\Property(
     *                     property="descricao",
     *                     type="string"
     *                 ),
     *                  @OA\Property(
     *                     property="observacao",
     *                     type="string"
     *                 ),
     *                  @OA\Property(
     *                     property="deletavel",
     *                     type="boolean"
     *                 ),
     *                 example={
     *                     "numero": "5899864",
     *                     "descricao": "Descrição da categoria",
     *                     "observacao": "Essa é uma observação",
     *                     "deletavel": true,
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
            
            $tipoAtividade = TipoAtividade::create($request->all());

            DB::commit();

            return response()->json(compact('tipoAtividade'), 201);

        } catch (Exception $exception) {
            DB::rollBack();
            return response()->json(['message' => self::MESSAGE_HTTP_ERROR_500], 500);
        }
    }

    /**
     * @OA\Get(
     *     path="/v1/tipo-atividade/{id}",
     *     tags={"TiposAtividades"},
     *     summary="Retorna um tipo de atividade via id cadastrado no banco de dados",
     *     description="Retorna um tipo de atividade via id",
     *     operationId="tipo_atividade_show",
     *     security={{"passport": {"*"}}},
     *     @OA\Parameter(
     *         name="id",
     *         in="path",
     *         description="ID of tipo atividade to return",
     *         required=true,
     *         @OA\Schema(
     *             type="integer",
     *             format="int64"
     *         )
     *     ),
     *     @OA\Response(
     *       @OA\MediaType(mediaType="application/json"),
     *       response=200,
     *       description="Retorna um tipo de atividade"
     *     ),
     *     @OA\Response(
     *       @OA\MediaType(mediaType="application/json"),
     *       response="401",
     *       description="Não autorizado. "
     *     ),
     *     @OA\Response(
     *       @OA\MediaType(mediaType="application/json"),
     *       response="404",
     *       description="Tipo de atividade não encontrado"
     *     )
     * )
     * @param int $funcionarioId
     * @return JsonResponse
     */
    public function show(int $tipoAtividadeId)
    {
        try {
            $tipoAtividade = TipoAtividade::find($tipoAtividadeId);

            if (is_null($tipoAtividade))
                return response()->json(['message' => 'Registro não enconrado.'], 404);

            return response()->json(compact('tipoAtividade'));

        } catch (Exception $exception) {
            return response()->json(['message' => self::MESSAGE_HTTP_ERROR_500], 500);
        }
    }

    /**
     * @OA\Put(
     *     path="/v1/tipo-atividade/{id}",
     *     tags={"TiposAtividades"},
     *     summary="Atualiza um tipo de atividade.",
     *     description="Atualiza um tipo de atividade.",
     *     operationId="tipo_atividade_update",
     *     security={{"passport": {"*"}}},
     *     @OA\Parameter(
     *         name="id",
     *         in="path",
     *         description="ID do tipo de atividade",
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
     *                      "deletavel"
     *                 },
     *                 @OA\Property(
     *                     property="numero",
     *                     type="integer"
     *                 ),
     *                  @OA\Property(
     *                     property="descricao",
     *                     type="string"
     *                 ),
     *                  @OA\Property(
     *                     property="observacao",
     *                     type="string"
     *                 ),
     *                  @OA\Property(
     *                     property="deletavel",
     *                     type="boolean"
     *                 ),
     *                 example={
     *                     "numero": "5899864",
     *                     "descricao": "Descrição da categoria",
     *                     "observacao": "Essa é uma observação",
     *                     "deletavel": false,
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
     * @param int $tipoAtividadeId
     * @return JsonResponse
     */
    public function update(Request $request, int $tipoAtividadeId)
    {
        try {
            DB::beginTransaction();

            $tipoAtividade = TipoAtividade::find($tipoAtividadeId);

            if (is_null($tipoAtividade)){
                DB::rollBack();
                return response()->json(['message' => __('geral.geral_nao_encontrado')], 404);
            }

            $validacao = $this->isValid($this->sanitize($request));

            if ($validacao->fails()) {
                DB::rollBack();
                return response()->json(['message' => $validacao->errors()], 400);
            }

            if(!$tipoAtividade->update($request->all())){
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
     *     path="/v1/tipo-atividade/{id}",
     *     tags={"TiposAtividades"},
     *     summary="Deleta um tipo de atividade.",
     *     description="Deleta um tipo de atividade.",
     *     operationId="tipo_atividade_delete",
     *     security={{"passport": {"*"}}},
     *     @OA\Parameter(
     *         name="id",
     *         in="path",
     *         description="ID do tipo de atividade para deletar",
     *         required=true,
     *         @OA\Schema(
     *             type="integer",
     *             format="int64"
     *         )
     *     ),
     *     @OA\Response(
     *       @OA\MediaType(mediaType="application/json"),
     *       response=204,
     *       description="Tipo excluído"
     *     ),
     *     @OA\Response(
     *       @OA\MediaType(mediaType="application/json"),
     *       response="401",
     *       description="Não autorizado. "
     *     ),
     *     @OA\Response(
     *         response="424",
     *         description="Tipo não cadastrado na base dados. "
     *     )
     * )
     * @param int $tipoAtividadeId
     * @return JsonResponse
     */
    public function destroy(int $tipoAtividadeId)
    {
        try {
            DB::beginTransaction();
            $tipoAtividade = TipoAtividade::find($tipoAtividadeId);

            if (is_null($tipoAtividade)){
                DB::rollBack();
                return response()->json(['message' => __('geral.geral_nao_encontrado')], 404);
            }

            if($tipoAtividade->deletavel === false || is_null($tipoAtividade->deletavel)){
                DB::rollBack();
                return response()->json(['message' => 'Esse tipo de atividade não pode ser deletada.'], 401);
            }

            if($tipoAtividade->delete()){
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
     *     path="/v1/tipo-atividade/search",
     *     tags={"TiposAtividades"},
     *     summary="Pesquisa tipos de atividades.",
     *     description="Pesquisa tipos de atividades.",
     *     operationId="tipo_atividade_search",
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
     *         description="Descrição do tipo de atividade a ser pesquisado",
     *         required=false,
     *         @OA\Schema(
     *             type="string",
     *             format="text"
     *         )
     *     ),
     *     @OA\Parameter(
     *         name="filter[observacao]",
     *         in="query",
     *         description="Observação do tipo de atividade a ser pesquisado",
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
        $tiposAtividades = QueryBuilder::for(TipoAtividade::class)
            ->allowedFilters(['descricao', 'observacao'])
            ->defaultSort('descricao')
            ->paginate($perPage)
            ->appends($request->query());

        if ( count( $tiposAtividades ) == 0){
            return response()->json([], 204);
        }

        return response()->json(compact('tiposAtividades'));
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
                'integer',
                Rule::unique('tipos_atividades')->ignore($request->id),
            ],
            'descricao' => 'required',
        ]);
    }
}
