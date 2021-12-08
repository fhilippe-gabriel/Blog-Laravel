<?php

namespace App\Http\Controllers\V1;

use Exception;
use App\Models\Certificado;
use App\Models\Funcionario;
use App\Models\Exame;
use App\Models\FuncionarioCertificado;
use App\Models\FuncionarioExame;
use Illuminate\Http\JsonResponse;
use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use Spatie\QueryBuilder\QueryBuilder;
use Illuminate\Validation\Rule;
use Illuminate\Support\Facades\DB;
use Spatie\QueryBuilder\AllowedFilter;

class CertificadoController extends Controller
{
    /**
     * @OA\Get(
     *   path="/v1/certificados",
     *   tags={"Certificados"},
     *   summary="Retorna os certificados cadastradas no banco",
     *   description="Retorna todos os certificados cadastrados no banco",
     *   operationId="certificado_index",
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
     *     description="Lista de Certificados"
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
            $certificados = Certificado::with('funcionarios')->orderBy('nome_certificado')->get();
        } else {
            $certificados = Certificado::with('funcionarios')->orderBy('nome_certificado')->paginate(self::getPageNumber($request));
        }

        if (is_null($certificados)){
            return response()->json([], 204);
        }

        return response()->json($certificados);
    }

    /**
     * @OA\Post(
     *     path="/v1/certificado",
     *     tags={"Certificados"},
     *     summary="Cadastra um certificado no banco",
     *     description="Exemplo de como cadastrar certificado via API",
     *     operationId="certificado_register",
     *     security={{"passport": {"*"}}},
     *     @OA\RequestBody(
     *         @OA\MediaType(
     *             mediaType="application/json",
     *             @OA\Schema(
     *                 required={
     *                      "nome_certificado",
     *                      "situacao"
     *                 },
     *                 @OA\Property(
     *                     property="nome_certificado",
     *                     type="string"
     *                 ),
     *                 @OA\Property(
     *                     property="validade_meses",
     *                     type="string"
     *                 ),
     *                 @OA\Property(
     *                     property="situacao",
     *                     type="string"
     *                 ),
     *                 example={
     *                     "nome_certificado" : "Curso de Mestre de Obras",
     *                     "validade_meses" : "1",
     *                     "situacao" : "ativo",
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
        try {
            DB::beginTransaction();
            $validacao = $this->isValid($request);

            if ($validacao->fails()) {
                DB::rollBack();
                return response()->json(['message' => $validacao->errors()], 400);
            }

            $certificado = Certificado::create($request->all());

            DB::commit();
            return response()->json(compact('certificado'), 201);

        } catch(Exception $exception) {
            DB::rollBack();
            return response()->json(['message' => self::MESSAGE_HTTP_ERROR_500], 500);
        }
    }

    /**
     * @OA\Get(
     *     path="/v1/certificado/{id}",
     *     tags={"Certificados"},
     *     summary="Retorna um certificado via id cadastrado no banco de dados",
     *     description="Retorna um certificado via id",
     *     operationId="certificado_show",
     *     security={{"passport": {"*"}}},
     *     @OA\Parameter(
     *         name="id",
     *         in="path",
     *         description="ID of certificado to return",
     *         required=true,
     *         @OA\Schema(
     *             type="integer",
     *             format="int64"
     *         )
     *     ),
     *     @OA\Parameter(
     *       name="funcionarios",
     *       in="query",
     *       description="Indica se retorna os funcionários que possuem essa certificação.",
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
     *       description="Retorna um Certificado"
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
     * @param int $certificadoId
     * @return JsonResponse
     */
    public function show(Request $request, int $certificadoId)
    {
        try {
            if ($request->funcionarios === 'true') {
                $certificado = Certificado::where('id', $certificadoId)->with('funcionarios')->find($certificadoId);
            } else {
                $certificado = Certificado::find($certificadoId);
            }

            if (is_null($certificado)){
                return response()->json(['message' => __('certificados.certificado_nao_encontrado')], 404);
            }

            return response()->json(compact('certificado'));

        } catch(Excepption $exception) {
            return response()->json(['message' => self::MESSAGE_HTTP_ERROR_500], 500);
        }
    }

    /**
     * @OA\Put(
     *     path="/v1/certificado/{id}",
     *     tags={"Certificados"},
     *     summary="Atualiza um certificado no banco",
     *     description="Exemplo de como atualizar um certificado via API",
     *     operationId="certificado_update",
     *     security={{"passport": {"*"}}},
     *     @OA\Parameter(
     *         name="id",
     *         in="path",
     *         description="ID of certificado to return",
     *         required=true,
     *         @OA\Schema(
     *             type="integer",
     *             format="int64"
     *         )
     *     ),
     *       @OA\RequestBody(
     *         @OA\MediaType(
     *             mediaType="application/json",
     *             @OA\Schema(
     *                 required={
     *                      "nome_certificado",
     *                      "situacao"
     *                 },
     *                 @OA\Property(
     *                     property="nome_certificado",
     *                     type="string"
     *                 ),
     *                 @OA\Property(
     *                     property="validade_meses",
     *                     type="string"
     *                 ),
     *                 @OA\Property(
     *                     property="situacao",
     *                     type="string"
     *                 ),
     *                 example={
     *                     "nome_certificado" : "Curso de Mestre de Obras 2",
     *                     "validade_meses" : 1,
     *                     "situacao" : "ativo",
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
     * @param int $certificadoId
     * @return JsonResponse
     */
    public function update(Request $request, int $certificadoId)
    {
        try {
            DB::beginTransaction();
            $certificado = Certificado::find($certificadoId);

            if (is_null($certificado)){
                DB::rollBack();
                return response()->json(['message' => __('certificados.certificado_nao_encontrado')], 404);
            }

            $validator = $this->isValid($request);

            if ($validator->fails()) {
                DB::rollBack();
                return response()->json(['message' => $validator->errors()], 400);
            }
            
            if(!$certificado->update($request->all())){
                DB::rollBack();
                return response()->json(['message' => __('certificados.certificado_atualizado_erro')], 400);
            }

            DB::commit();
            return response()->json(['message' => __('certificados.certificado_atualizado_sucesso')], 200);

        } catch (Exception $exception) {
            DB::rollBack();
            return response()->json(['message' => self::MESSAGE_HTTP_ERROR_500], 500);
        }
    }

    /**
     * Remove the specified resource from storage.
     *
     * @OA\Delete(
     *     path="/v1/certificado/{id}",
     *     tags={"Certificados"},
     *     summary="Deleta um certificado.",
     *     description="Deleta um certificado.",
     *     operationId="certificado_delete",
     *     security={{"passport": {"*"}}},
     *     @OA\Parameter(
     *         name="id",
     *         in="path",
     *         description="ID do certificado para deletar",
     *         required=true,
     *         @OA\Schema(
     *             type="integer",
     *             format="int64"
     *         )
     *     ),
     *     @OA\Response(
     *       @OA\MediaType(mediaType="application/json"),
     *       response=204,
     *       description="Certificado excluído"
     *     ),
     *     @OA\Response(
     *       @OA\MediaType(mediaType="application/json"),
     *       response="401",
     *       description="Não autorizado. "
     *     ),
     *     @OA\Response(
     *         response="424",
     *         description="certificado não cadastrado na base dados. "
     *     )
     * )
     * @param int $certificadoId
     * @return JsonResponse
     */
    public function destroy(int $certificadoId) 
    {
        try {
            DB::beginTransaction();

            $certificado = Certificado::find($certificadoId);

            if (is_null($certificado)){
                DB::rollBack();
                return response()->json(['message' => __('certificados.certificado_nao_encontrado')], 424);
            }

            $certificado->delete();

            DB::commit();
            return response()->json(['message' => __('certificados.certificado_excluido_sucesso')], 200);

        } catch (Exception $exception) {
            DB::rollBack();
            return response()->json(['message' => self::MESSAGE_HTTP_ERROR_500], 500);
        }
    }

    /**
     * Search in the model.
     *
     * @OA\GET(
     *     path="/v1/certificado/search",
     *     tags={"Certificados"},
     *     summary="Pesquisa certificados.",
     *     description="Pesquisa certificados.",
     *     operationId="certificado_search",
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
     *         name="filter[nome_certificado]",
     *         in="query",
     *         description="Nome do certificado a ser pesquisado",
     *         required=false,
     *         @OA\Schema(
     *             type="string",
     *             format="text"
     *         )
     *     ),
     *     @OA\Parameter(
     *         name="filter[situacao]",
     *         in="query",
     *         description="Situação do certificado a ser pesquisado",
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
        $certificados = QueryBuilder::for(Certificado::class)
            ->allowedFilters(['nome_certificado', AllowedFilter::exact('situacao')])
            ->defaultSort('nome_certificado')
            ->paginate($perPage)
            ->appends($request->query());

        if ( count( $certificados ) == 0){
            return response()->json([], 204);
        }

        return response()->json(compact('certificados'));
    }

    /**
     * @OA\Get(
     *   path="/v1/certificado/situacoes",
     *   tags={"Certificados"},
     *   summary="Retorna as situações que são aceitas para o certificado",
     *   description="Retorna as situações que são aceitas para o certificado",
     *   operationId="certificado_situacoes",
     *   security={{"passport": {"*"}}},
     *   @OA\Response(
     *     @OA\MediaType(mediaType="application/json"),
     *     response=200,
     *     description="Lista de Situações"
     *   ),
     *   @OA\Response(
     *     @OA\MediaType(mediaType="application/json"),
     *     response="401",
     *     description="Não autorizado. "
     *   ),
     *   @OA\Response(
     *     @OA\MediaType(mediaType="application/json"),
     *     response="default",
     *     description="Erro"
     *   )
     * )
     * @param Request $request
     * @return JsonResponse
     */
    public function situacoes()
    {
        return response()->json([Certificado::SITUACOES]);
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
            'nome_certificado'      => 'string|required',
            'validade_meses'        => 'integer|nullable',
            'situacao'              => ['required', 'string', Rule::in(array_keys(Certificado::SITUACOES))],
        ]);
    }
}
