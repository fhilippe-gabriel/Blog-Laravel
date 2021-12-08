<?php

namespace App\Http\Controllers\V1;

use App\Models\TipoRecurso;
use App\Http\Controllers\Controller;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Exception;
use Illuminate\Support\Facades\Validator;
use Spatie\QueryBuilder\QueryBuilder;
use Illuminate\Support\Facades\DB;
use Illuminate\Validation\Rule;

class TipoRecursoController extends Controller
{
    /**
     * Display a listing of the resource.
     *
     * @OA\Get(
     *   path="/v1/tipos-recursos",
     *   summary="Retorna os tipos de recursos.",
     *   description="Retorna os tipos de recursos que são aceitas pelo sistema.",
     *   tags={"TiposRecursos"},
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
     *     description="Lista de tipos de recursos"
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
            $tiposRecursos = TipoRecurso::orderBy('descricao')->get();
        } else {
            $tiposRecursos = TipoRecurso::orderBy('descricao')->paginate(self::getPageNumber($request));
        }

        if (is_null($tiposRecursos)){
            return response()->json([], 204);
        }

        return response()->json($tiposRecursos);
    }

    /**
     * @OA\Post(
     *     path="/v1/tipo-recurso",
     *     tags={"TiposRecursos"},
     *     summary="Cadastra um novo tipo de recurso.",
     *     description="Cadastra um novo tipo de recurso.",
     *     operationId="tipo_recurso_register",
     *     security={{"passport": {"*"}}},
     *     @OA\RequestBody(
     *         @OA\MediaType(
     *             mediaType="application/json",
     *             @OA\Schema(
     *                 required={
     *                      "numero",
     *                      "descricao"
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
     *                 example={
     *                     "numero": "5899864",
     *                     "descricao": "Descrição do tipo do recurso",
     *                     "observacao": "Essa é uma observação do tipo do recurso",
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
            
            $tipoRecurso = TipoRecurso::create($request->all());

            DB::commit();

            return response()->json(compact('tipoRecurso'), 201);

        } catch (Exception $exception) {
            DB::rollBack();
            return response()->json(['message' => self::MESSAGE_HTTP_ERROR_500], 500);
        }
    }

    /**
     * @OA\Get(
     *     path="/v1/tipo-recurso/{id}",
     *     tags={"TiposRecursos"},
     *     summary="Retorna um tipo de recurso via id cadastrado no banco de dados",
     *     description="Retorna um tipo de recurso via id",
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
     *       description="Retorna um tipo de recurso"
     *     ),
     *     @OA\Response(
     *       @OA\MediaType(mediaType="application/json"),
     *       response="401",
     *       description="Não autorizado. "
     *     ),
     *     @OA\Response(
     *       @OA\MediaType(mediaType="application/json"),
     *       response="404",
     *       description="Tipo de recurso não encontrado"
     *     )
     * )
     * @param int $funcionarioId
     * @return JsonResponse
     */
    public function show(int $tipoRecursoId)
    {
        try {
            $tipoRecurso = TipoRecurso::find($tipoRecursoId);

            if (is_null($tipoRecurso))
                return response()->json(['message' => __('geral.geral_nao_encontrado')], 404);

            return response()->json(compact('tipoRecurso'));

        } catch (Exception $exception) {
            return response()->json(['message' => self::MESSAGE_HTTP_ERROR_500], 500);
        }
    }

    /**
     * @OA\Put(
     *     path="/v1/tipo-recurso/{id}",
     *     tags={"TiposRecursos"},
     *     summary="Atualiza um tipo de recurso.",
     *     description="Atualiza um tipo de recurso.",
     *     operationId="tipo_recurso_update",
     *     security={{"passport": {"*"}}},
     *     @OA\Parameter(
     *         name="id",
     *         in="path",
     *         description="ID do tipo de recurso",
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
     *                      "descricao"
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
     *                 example={
     *                     "numero": "5899864",
     *                     "descricao": "Descrição do tipo do recurso",
     *                     "observacao": "Essa é uma observação do tipo do recurso",
     *                 }
     *             )
     *         )
     *     ),
     *     @OA\Response(
     *         response="200",
     *         description="Tipo de recurso atualizado"
     *     ),
     *     @OA\Response(
     *         response="400",
     *         description="Erro ao atualizar"
     *     ),
     *     @OA\Response(
     *         response="404",
     *         description="Tipo de recurso não encontrado"
     *     ),
     *     @OA\Response(
     *         response="401",
     *         description="Não autorizado"
     *     )
     * )
     * @param Request $request
     * @param int $tipoRecursoId
     * @return JsonResponse
     */
    public function update(Request $request, int $tipoRecursoId)
    {
        try {
            DB::beginTransaction();

            $tipoRecurso = TipoRecurso::find($tipoRecursoId);

            if (is_null($tipoRecurso)){
                DB::rollBack();
                return response()->json(['message' => __('geral.geral_nao_encontrado')], 404);
            }

            $validacao = $this->isValid($this->sanitize($request));

            if ($validacao->fails()) {
                DB::rollBack();
                return response()->json(['message' => $validacao->errors()], 400);
            }

            if(!$tipoRecurso->update($request->all())){
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
     *     path="/v1/tipo-recurso/{id}",
     *     tags={"TiposRecursos"},
     *     summary="Deleta um tipo de recurso.",
     *     description="Deleta um tipo de recurso.",
     *     operationId="tipo_recurso_delete",
     *     security={{"passport": {"*"}}},
     *     @OA\Parameter(
     *         name="id",
     *         in="path",
     *         description="ID do tipo de recurso para deletar",
     *         required=true,
     *         @OA\Schema(
     *             type="integer",
     *             format="int64"
     *         )
     *     ),
     *     @OA\Response(
     *       @OA\MediaType(mediaType="application/json"),
     *       response=200,
     *       description="Tipo de recurso excluído"
     *     ),
     *     @OA\Response(
     *       @OA\MediaType(mediaType="application/json"),
     *       response="401",
     *       description="Não autorizado. "
     *     ),
     *     @OA\Response(
     *         response="404",
     *         description="Tipo não cadastrado na base dados. "
     *     )
     * )
     * @param int $tipoRecursoId
     * @return JsonResponse
     */
    public function destroy(int $tipoRecursoId)
    {
        try {
            DB::beginTransaction();
            $tipoRecurso = TipoRecurso::find($tipoRecursoId);

            if (is_null($tipoRecurso)){
                DB::rollBack();
                return response()->json(['message' => __('geral.geral_nao_encontrado')], 404);
            }

            if($tipoRecurso->delete()){
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
     *     path="/v1/tipo-recurso/search",
     *     tags={"TiposRecursos"},
     *     summary="Pesquisa tipos de recursos.",
     *     description="Pesquisa tipos de recursos.",
     *     operationId="tipo_recurso_search",
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
     *         description="Descrição do tipo de recurso a ser pesquisado",
     *         required=false,
     *         @OA\Schema(
     *             type="string",
     *             format="text"
     *         )
     *     ),
     *     @OA\Parameter(
     *         name="filter[observacao]",
     *         in="query",
     *         description="Observação do tipo de recurso a ser pesquisado",
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
        $tiposRecursos = QueryBuilder::for(TipoRecurso::class)
            ->allowedFilters(['descricao', 'observacao'])
            ->defaultSort('descricao')
            ->paginate($perPage)
            ->appends($request->query());

        if ( count( $tiposRecursos ) == 0){
            return response()->json([], 204);
        }

        return response()->json(compact('tiposRecursos'));
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
                Rule::unique('tipos_recursos')->ignore($request->id),
            ],
            'descricao' => 'required',
        ]);
    }
}
