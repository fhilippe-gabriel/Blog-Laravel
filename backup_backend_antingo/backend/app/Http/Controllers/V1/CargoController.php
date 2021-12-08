<?php

namespace App\Http\Controllers\V1;

use Exception;
use App\Models\Cargo;
use App\Models\Funcionario;
use Illuminate\Http\JsonResponse;
use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\DB;
use Spatie\QueryBuilder\QueryBuilder;

class CargoController extends Controller
{
    /**
     * @OA\Get(
     *   path="/v1/cargos",
     *   tags={"Cargos"},
     *   summary="Retorna os cargos cadastrados",
     *   description="Retorna todos os cargos cadastrados no Banco de Dados",
     *   operationId="cargo_index",
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
     *     description="Lista de Cargos"
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
            $cargos = Cargo::with('funcionarios')->orderBy('cargo')->get();
        } else {
            $cargos = Cargo::with('funcionarios')->orderBy('cargo')->paginate(self::getPageNumber($request));
        }

        if (is_null($cargos)){
            return response()->json([], 204);
        }

        return response()->json($cargos);
    }

    /**
     * @OA\Post(
     *     path="/v1/cargo",
     *     tags={"Cargos"},
     *     summary="Cadastra um cargo no Banco de Dados",
     *     description="Exemplo de como cadastrar cargo via API",
     *     operationId="cargo_register",
     *     security={{"passport": {"*"}}},
     *     @OA\RequestBody(
     *         @OA\MediaType(
     *             mediaType="application/json",
     *             @OA\Schema(
     *                 required={
     *                      "cargo"
     *                 },
     *                 @OA\Property(
     *                     property="cargo",
     *                     type="string"
     *                 ),
     *                 @OA\Property(
     *                     property="descricao",
     *                     type="string"
     *                 ),
     *                 @OA\Property(
     *                     property="detalhes",
     *                     type="string"
     *                 ),
     *                 example={
     *                     "cargo" : "Mestre de Obras",
     *                     "descricao" : "Gerenciar toda equipe de Obras",
     *                     "detalhes" : "Neste cargo será desenvolvido as seguintes operações..."
     *                 }
     *             )
     *         )
     *     ),
     *     @OA\Response(
     *         response="200",
     *         description="Operação realizada com sucesso!"
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
        try{
            DB::beginTransaction();
            $validacao = $this->isValid($request);

            if ($validacao->fails()) {
                DB::rollBack();
                return response()->json(['message' => $validacao->errors()], 400);
            }

            $cargo = Cargo::create($request->all());

            DB::commit();
            return response()->json(compact('cargo'), 201);

        }catch(Exception $exception){
            DB::rollBack();
            return response()->json(['message' => self::MESSAGE_HTTP_ERROR_500], 500);
        }
    }

    /**
     * @OA\Get(
     *     path="/v1/cargo/{id}",
     *     tags={"Cargos"},
     *     summary="Retorna um cargo pelo id cadastrado no Banco de Dados",
     *     description="A sample greeting to test out the API",
     *     operationId="cargo_show",
     *     security={{"passport": {"*"}}},
     *     @OA\Parameter(
     *         name="id",
     *         in="path",
     *         description="ID of cargo to return",
     *         required=true,
     *         @OA\Schema(
     *             type="integer",
     *             format="int64"
     *         )
     *     ),
     *     @OA\Parameter(
     *       name="funcionarios",
     *       in="query",
     *       description="Indica se retorna os funcionários que possuem esse cargo.",
     *       required=false,
     *       @OA\Schema(
     *           type="string",
     *           enum={"true", "false"},
     *           default="false"
     *       )
     *     ),
     *     @OA\Response(
     *       @OA\MediaType(mediaType="application/json"),
     *       response=200,
     *       description="Retorna um Cargo"
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
     * @param int $cargoId
     * @return JsonResponse
     */
    public function show(Request $request, int $cargoId)
    {
        try {
            if ($request->funcionarios === 'true') {
                $cargo = Cargo::with('funcionarios')->find($cargoId);
            } else {
                $cargo = Cargo::find($cargoId);
            }

            if (is_null($cargo))
                return response()->json(['message' => __('cargos.cargo_nao_encontrado')], 404);

            return response()->json(compact('cargo'));

        } catch (Exception $exception) {
            return response()->json(['message' => self::MESSAGE_HTTP_ERROR_500], 500);
        }
    }

    /**
     * @OA\Put(
     *     path="/v1/cargo/{id}",
     *     tags={"Cargos"},
     *     summary="Atualiza um cargo no banco",
     *     description="Exemplo de como atualizar um cargo via API",
     *     operationId="cargo_update",
     *     security={{"passport": {"*"}}},
     *     @OA\Parameter(
     *         name="id",
     *         in="path",
     *         description="ID do cargo para atualizar",
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
     *                      "cargo"
     *                 },
     *                 @OA\Property(
     *                     property="cargo",
     *                     type="string"
     *                 ),
     *                  @OA\Property(
     *                     property="descricao",
     *                     type="string"
     *                 ),
     *                  @OA\Property(
     *                     property="detalhes",
     *                     type="string"
     *                 ),
     *                 example={
     *                     "cargo": "Nome do Cargo",
     *                     "descricao": "Descrição do cargo",
     *                     "detalhes": "Detalhes das atividades desenvolvidas no cargo"
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
     * @param int $cargoId
     * @return JsonResponse
     */
    public function update(Request $request, int $cargoId)
    {
        try {
            DB::beginTransaction();
            $cargo = Cargo::find($cargoId);

            if (is_null($cargo)){
                DB::rollBack();
                return response()->json(['message' => __('cargos.cargo_nao_encontrado')], 424);
            }

            $validacao = $this->isValid($request);

            if ($validacao->fails()) {
                DB::rollBack();
                return response()->json(['message' => $validacao->errors()], 400);
            }

            if(!$cargo->update($request->all())){
                DB::rollBack();
                return response()->json(['message' => __('cargos.cargo_atualizado_erro')], 400);
            }

            DB::commit();
            return response()->json(['message' => __('cargos.cargo_atualizado_sucesso')], 200);

        } catch (Exception $exception) {
            DB::rollBack();
            return response()->json(['message' => self::MESSAGE_HTTP_ERROR_500], 500);
        }
    }

  /**
     * Remove the specified resource from storage.
     *
     * @OA\Delete(
     *     path="/v1/cargo/{id}",
     *     tags={"Cargos"},
     *     summary="Deleta um cargo.",
     *     description="Deleta um cargo.",
     *     operationId="cargo_delete",
     *     security={{"passport": {"*"}}},
     *     @OA\Parameter(
     *         name="id",
     *         in="path",
     *         description="ID do cargo para deletar",
     *         required=true,
     *         @OA\Schema(
     *             type="integer",
     *             format="int64"
     *         )
     *     ),
     *     @OA\Response(
     *       @OA\MediaType(mediaType="application/json"),
     *       response=204,
     *       description="Cargo excluído"
     *     ),
     *     @OA\Response(
     *       @OA\MediaType(mediaType="application/json"),
     *       response="401",
     *       description="Não autorizado. "
     *     ),
     *     @OA\Response(
     *         response="424",
     *         description="Cargo não cadastrado na base dados. "
     *     )
     * )
     * @param int $cargoId
     * @return JsonResponse
     */
    public function destroy(int $cargoId)
    {
        try {
            DB::beginTransaction();
            $cargo = Cargo::find($cargoId);

            if (is_null($cargo)){
                DB::rollBack();
                return response()->json(['message' => __('cargos.cargo_nao_encontrado')], 424);
            }

            if($cargo->delete()){
                DB::commit();
                return response()->json(['message' => __('cargos.cargo_excluido_sucesso')], 200);
            }

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
     *     path="/v1/cargo/search",
     *     tags={"Cargos"},
     *     summary="Pesquisa cargos.",
     *     description="Pesquisa cargos.",
     *     operationId="cargo_search",
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
     *         name="filter[cargo]",
     *         in="query",
     *         description="Nome do cargo a ser pesquisado",
     *         required=false,
     *         @OA\Schema(
     *             type="string",
     *             format="text"
     *         )
     *     ),
     *     @OA\Parameter(
     *         name="filter[descricao]",
     *         in="query",
     *         description="Descrição do cargo a ser pesquisado",
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
        $cargos = QueryBuilder::for(Cargo::class)
            ->allowedFilters(['cargo', 'descricao'])
            ->defaultSort('cargo')
            ->paginate($perPage)
            ->appends($request->query());

        if ( count( $cargos ) == 0){
            return response()->json([], 204);
        }

        return response()->json(compact('cargos'));
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
            'cargo'         => 'required'
        ]);
     }
}
