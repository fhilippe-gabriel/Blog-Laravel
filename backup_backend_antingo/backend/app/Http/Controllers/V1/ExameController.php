<?php

namespace App\Http\Controllers\V1;

use Exception;
use App\Models\Exame;
use App\Models\Funcionario;
use App\Models\Certificado;
use Illuminate\Http\JsonResponse;
use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use Spatie\QueryBuilder\AllowedFilter;
use Spatie\QueryBuilder\QueryBuilder;
use Illuminate\Support\Facades\DB;

class ExameController extends Controller
{

    /**
     * @OA\Get(
     *   path="/v1/exames",
     *   tags={"Exames"},
     *   summary="Retorna os exames cadastradas no banco",
     *   description="Retorna todos os exames cadastrados no banco",
     *   operationId="exame_index",
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
     *     description="Lista de Exames cadastrados"
     *   ),
     *   @OA\Response(
     *     @OA\MediaType(mediaType="application/json"),
     *     response="401",
     *     description="Não autorizado."
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
            $exames = Exame::with('funcionarios')->orderBy('nome_exame')->get();
        } else {
            $exames = Exame::with('funcionarios')->orderBy('nome_exame')->paginate(self::getPageNumber($request));
        }

        if (is_null($exames)){
            return response()->json([], 204);
        }

        return response()->json($exames);
    }

    /**
     * @OA\Get(
     *     path="/v1/exame/{id}",
     *     tags={"Exames"},
     *     summary="Retorna um exame via id cadastrado no banco",
     *     description="Retorna o exame via id",
     *     operationId="exame_show",
     *     security={{"passport": {"*"}}},
     *     @OA\Parameter(
     *         name="id",
     *         in="path",
     *         description="ID of exame to return",
     *         required=true,
     *         @OA\Schema(
     *             type="integer",
     *             format="int64"
     *         )
     *     ),
     *     @OA\Parameter(
     *       name="funcionarios",
     *       in="query",
     *       description="Indica se deve retornar os funcionários que possuem esse exame.",
     *       required=false,
     *       @OA\Schema(
     *           type="string",
     *           enum={"true", "false"},
     *           default=false
     *       )
     *     ),
     *     @OA\Response(
     *       @OA\MediaType(mediaType="application/json"),
     *       response=200,
     *       description="Retorna os Exames"
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
     * @param int $exameId
     * @return JsonResponse
     */
    public function show(Request $request, int $exameId)
    {
        try {
            if ($request->funcionarios === 'true') {
                $exame = Exame::where('id', $exameId)->with('funcionarios')->find($exameId);
            } else {
                $exame = Exame::find($exameId);
            }

            if (is_null($exame)) {
                return response()->json(['message' => __('exames.exames_nao_encontrado')], 404);
            }

            return response()->json(compact('exame'));

        } catch (Exception $exception) {
            return response()->json(['message' => self::MESSAGE_HTTP_ERROR_500], 500);
        }
    }

    /**
     * @OA\Post(
     *     path="/v1/exame",
     *     tags={"Exames"},
     *     summary="Cadastra um exame no banco",
     *     description="Exemplo de como cadastrar exame via API",
     *     operationId="exame_register",
     *     security={{"passport": {"*"}}},
     *     @OA\RequestBody(
     *         @OA\MediaType(
     *             mediaType="application/json",
     *             @OA\Schema(
     *                 required={
     *                      "nome_exame",
     *                      "tipo_exame"
     *                 },
     *                 @OA\Property(
     *                     property="nome_exame",
     *                     type="string"
     *                 ),
     *                 @OA\Property(
     *                     property="tipo_exame",
     *                     type="string"
     *                 ),
     *                 @OA\Property(
     *                     property="observacao",
     *                     type="string"
     *                 ),
     *                 @OA\Property(
     *                     property="validade_meses",
     *                     type="string"
     *                 ),
     *                 example={
     *                     "nome_exame": "Toledo2 Comercial Ltda.",
     *                     "tipo_exame": "atestado",
     *                     "observacao": "Tempore laudantium placeat nobis natus.",
     *                     "validade_meses": "0",
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
            $validacao = $this->isValid($request);

            if ($validacao->fails()) {
                DB::rollBack();
                return response()->json(['message' => $validacao->errors()], 400);
            }

            $exame = Exame::create($request->all());

            DB::commit();
            return response()->json(compact('exame'), 201);

        } catch (Exception $exception) {
            DB::rollBack();
            return response()->json(['message' => self::MESSAGE_HTTP_ERROR_500], 500);
        }
    }

    /**
     * @OA\Put(
     *     path="/v1/exame/{id}",
     *     tags={"Exames"},
     *     summary="Atualiza um exame no banco",
     *     description="Exemplo de como atualizar um exame via API",
     *     operationId="exame_update",
     *     security={{"passport": {"*"}}},
     *     @OA\Parameter(
     *         name="id",
     *         in="path",
     *         description="ID of exame to return",
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
     *                      "nome_exame",
     *                      "tipo_exame"
     *                 },
     *                 @OA\Property(
     *                     property="nome_exame",
     *                     type="string"
     *                 ),
     *                  @OA\Property(
     *                     property="tipo_exame",
     *                     type="string"
     *                 ),
     *                  @OA\Property(
     *                     property="observacao",
     *                     type="string"
     *                 ),
     *                  @OA\Property(
     *                     property="validade_meses",
     *                     type="string"
     *                 ),
     *                 example={
     *                     "nome_exame": "Exame de Sangue",
     *                     "tipo_exame": "admissao",
     *                     "observacao": "Exame de teste a realizar",
     *                     "validade_meses": 1,
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
     * @param int $exameId
     * @return JsonResponse
     */
    public function update(Request $request, int $exameId)
    {
        try {
            DB::beginTransaction();

            $exame = Exame::find($exameId);

            if (is_null($exame)) {
                DB::rollBack();
                return response()->json(['message' => __('exames.exames_nao_encontrado')], 424);
            }

            $validator = $this->isValid($request);

            if ($validator->fails()) {
                DB::rollBack();
                return response()->json(['message' => $validator->errors()], 400);
            }

            if(!$exame->update($request->all())){
                DB::rollBack();
                return response()->json(['message' => __('exames.exames_atualizado_erro')], 400);
            }
            
            DB::commit();
            return response()->json(['message' => __('exames.exames_atualizado_sucesso')], 200);

        } catch (Exception $exception) {
            DB::rollBack();
            return response()->json(['message' => self::MESSAGE_HTTP_ERROR_500], 500);
        }
    }

    /**
     * Remove the specified resource from storage.
     *
     * @OA\Delete(
     *     path="/v1/exame/{id}",
     *     tags={"Exames"},
     *     summary="Deleta um exame.",
     *     description="Deleta um exame.",
     *     operationId="exame_delete",
     *     security={{"passport": {"*"}}},
     *     @OA\Parameter(
     *         name="id",
     *         in="path",
     *         description="ID do exame para deletar",
     *         required=true,
     *         @OA\Schema(
     *             type="integer",
     *             format="int64"
     *         )
     *     ),
     *     @OA\Response(
     *       @OA\MediaType(mediaType="application/json"),
     *       response=204,
     *       description="Exame excluído"
     *     ),
     *     @OA\Response(
     *       @OA\MediaType(mediaType="application/json"),
     *       response="401",
     *       description="Não autorizado. "
     *     ),
     *     @OA\Response(
     *         response="424",
     *         description="Exame não cadastrado na base dados. "
     *     )
     * )
     * @param int $exameId
     * @return JsonResponse
     */
    public function destroy(int $exameId)
    {
        try {
            DB::beginTransaction();
            $exame = Exame::find($exameId);

            if (is_null($exame)) {
                DB::rollBack();
                return response()->json(['message' => __('exames.exames_nao_encontrado')], 424);
            }

            $exame->delete();

            DB::commit();
            return response()->json(['message' =>  __('exames.exames_excluido_sucesso')], 200);
        
        } catch (Exception $exception) {
                DB::rollBack();
            return response()->json(['message' => self::MESSAGE_HTTP_ERROR_500], 500);
        }
    }

    /**
     * Search in the model.
     *
     * @OA\GET(
     *     path="/v1/exame/search",
     *     tags={"Exames"},
     *     summary="Pesquisa exames.",
     *     description="Pesquisa exames.",
     *     operationId="exame_search",
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
     *         name="filter[nome_exame]",
     *         in="query",
     *         description="Nome do exame a ser pesquisado",
     *         required=false,
     *         @OA\Schema(
     *             type="string",
     *             format="text"
     *         )
     *     ),
     *     @OA\Parameter(
     *         name="filter[tipo_exame]",
     *         in="query",
     *         description="Tipo do exame a ser pesquisado",
     *         required=false,
     *         @OA\Schema(
     *             type="string",
     *             format="text"
     *         )
     *     ),
     *     @OA\Parameter(
     *         name="filter[validade_meses]",
     *         in="query",
     *         description="A validade, em meses, do exame a ser pesquisado",
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
        $exames = QueryBuilder::for(Exame::class)
            ->allowedFilters(['nome_exame', AllowedFilter::exact('tipo_exame'), AllowedFilter::exact('validade_meses')])
            ->defaultSort('nome_exame')
            ->paginate($perPage)
            ->appends($request->query());

        if ( count( $exames ) == 0){
            return response()->json([], 204);
        }

        return response()->json(compact('exames'));
    }

    private function isValid(Request $request)
    {
        return Validator::make($request->all(), [
            'nome_exame' => 'required',
            'tipo_exame' => 'required',
        ]);
    }
}
