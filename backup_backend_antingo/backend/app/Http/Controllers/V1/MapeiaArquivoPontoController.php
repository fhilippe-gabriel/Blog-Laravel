<?php

namespace App\Http\Controllers\V1;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use App\Models\MapeiaArquivoPonto;
use Exception;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\DB;

class MapeiaArquivoPontoController extends Controller
{
    /**
     * Display a listing of the resource.
     *
     * @OA\Get(
     *   path="/v1/mapeia-arquivos-ponto",
     *   summary="Retorna os mapeamentos dos arquivos de ponto.",
     *   description="Retorna os mapeamentos dos arquivos de ponto",
     *   tags={"MapeiaArquivosPontos"},
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
     *     description="Lista os itens"
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
            $mapeiaArquivoPonto = MapeiaArquivoPonto::all();
        } else {
            $mapeiaArquivoPonto = MapeiaArquivoPonto::paginate(self::getPageNumber($request));
        }

        if (is_null($mapeiaArquivoPonto)){
            return response()->json([], 204);
        }

        return response()->json($mapeiaArquivoPonto);
    }

    /**
     * @OA\Post(
     *     path="/v1/mapeia-arquivo-ponto",
     *     tags={"MapeiaArquivosPontos"},
     *     summary="Cadastra um novo mapeamento de arquivo de monto.",
     *     description="Cadastra um novo mapeamento de arquivo de monto.",
     *     operationId="mapeia_arquivo_ponto_register",
     *     security={{"passport": {"*"}}},
     *     @OA\RequestBody(
     *         @OA\MediaType(
     *             mediaType="application/json",
     *             @OA\Schema(
     *                 required={
     *                      "coluna_arquivo",
     *                      "coluna_banco_dados",
     *                      "cliente_id"
     *                 },
     *                 @OA\Property(
     *                     property="coluna_arquivo",
     *                     type="string"
     *                 ),
     *                  @OA\Property(
     *                     property="coluna_banco_dados",
     *                     type="string"
     *                 ),
     *                  @OA\Property(
     *                     property="cliente_id",
     *                     type="integer"
     *                 ),
     *                 example={
     *                  {
     *                      "coluna_arquivo": "Hora",
     *                      "coluna_banco_dados": "hora_saida",
     *                      "cliente_id": "1"
     *                  },
     *                  {
     *                      "coluna_arquivo": "Hora",
     *                      "coluna_banco_dados": "hora_entrada",
     *                      "cliente_id": "1"
     *                  },
     *                  {
     *                      "coluna_arquivo": "entrada/saida",
     *                      "coluna_banco_dados": "hora_saida",
     *                      "cliente_id": "1"
     *                  },
     *                  {
     *                      "coluna_arquivo": "Data",
     *                      "coluna_banco_dados": "data_ponto",
     *                      "cliente_id": "1"
     *                  },
     *                 }
     *             )
     *         )
     *     ),
     *     @OA\Response(
     *         response="201",
     *         description="Operação realizada com sucesso"
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
            
            $mapeiaArquivoPonto = MapeiaArquivoPonto::create($request->all());

            DB::commit();

            return response()->json(compact('mapeiaArquivoPonto'), 201);

        } catch (Exception $exception) {
            DB::rollBack();
            return response()->json(['message' => $exception->getMessage()], 500);
            return response()->json(['message' => self::MESSAGE_HTTP_ERROR_500], 500);
        }
    }

    /**
     * @OA\Get(
     *     path="/v1/mapeia-arquivo-ponto/{id}",
     *     tags={"MapeiaArquivosPontos"},
     *     summary="Retorna um mapeamento de arquivo de ponto",
     *     description="Retorna um mapeamento de arquivo de ponto via id",
     *     operationId="mapeia_arquivo_ponto_show",
     *     security={{"passport": {"*"}}},
     *     @OA\Parameter(
     *         name="id",
     *         in="path",
     *         description="ID do mapeamento do arquivo de ponto",
     *         required=true,
     *         @OA\Schema(
     *             type="integer",
     *             format="int64"
     *         )
     *     ),
     *     @OA\Response(
     *       @OA\MediaType(mediaType="application/json"),
     *       response=200,
     *       description="Retorna um mapeamento de arquivo de ponto"
     *     ),
     *     @OA\Response(
     *       @OA\MediaType(mediaType="application/json"),
     *       response="401",
     *       description="Não autorizado. "
     *     ),
     *     @OA\Response(
     *       @OA\MediaType(mediaType="application/json"),
     *       response="404",
     *       description="Mapeamento de arquivo de ponto não encontrado"
     *     )
     * )
     * @param int $funcionarioId
     * @return JsonResponse
     */
    public function show(int $mapeiaArquivoPontoId)
    {
        try {
            $mapeiaArquivoPonto = MapeiaArquivoPonto::find($mapeiaArquivoPontoId);

            if (is_null($mapeiaArquivoPonto))
                return response()->json(['message' => __('geral.geral_nao_encontrado')], 404);

            return response()->json(compact('mapeiaArquivoPonto'));

        } catch (Exception $exception) {
            return response()->json(['message' => self::MESSAGE_HTTP_ERROR_500], 500);
        }
    }

    /**
     * @OA\Put(
     *     path="/v1/mapeia-arquivo-ponto/{id}",
     *     tags={"MapeiaArquivosPontos"},
     *     summary="Atualiza um mapeamento de arquivo de ponto.",
     *     description="Atualiza um mapeamento de arquivo de ponto.",
     *     operationId="mapeia_arquivo_ponto_update",
     *     security={{"passport": {"*"}}},
     *     @OA\Parameter(
     *         name="id",
     *         in="path",
     *         description="ID do mapeamento de arquivo de ponto",
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
     *                      "coluna_arquivo",
     *                      "coluna_banco_dados",
     *                      "cliente_id"
     *                 },
     *                 @OA\Property(
     *                     property="coluna_arquivo",
     *                     type="string"
     *                 ),
     *                  @OA\Property(
     *                     property="coluna_banco_dados",
     *                     type="string"
     *                 ),
     *                  @OA\Property(
     *                     property="cliente_id",
     *                     type="integer"
     *                 ),
     *                 example={
     *                     "coluna_arquivo": "matricula",
     *                     "coluna_banco_dados": "funcionario_id",
     *                     "cliente_id": "1"
     *                 }
     *             )
     *         )
     *     ),
     *     @OA\Response(
     *         response="200",
     *         description="Mapemaneto do arquivo de ponto atualizado"
     *     ),
     *     @OA\Response(
     *         response="400",
     *         description="Erro ao atualizar"
     *     ),
     *     @OA\Response(
     *         response="404",
     *         description="Mapemaneto do arquivo de ponto não encontrado"
     *     ),
     *     @OA\Response(
     *         response="401",
     *         description="Não autorizado"
     *     )
     * )
     * @param Request $request
     * @param int $mapeiaArquivoPontoId
     * @return JsonResponse
     */
    public function update(Request $request, int $mapeiaArquivoPontoId)
    {
        try {
            DB::beginTransaction();

            $mapeiaArquivoPonto = MapeiaArquivoPonto::find($mapeiaArquivoPontoId);

            if (is_null($mapeiaArquivoPonto)){
                DB::rollBack();
                return response()->json(['message' => __('geral.geral_nao_encontrado')], 404);
            }

            $validacao = $this->isValid($this->sanitize($request));

            if ($validacao->fails()) {
                DB::rollBack();
                return response()->json(['message' => $validacao->errors()], 400);
            }

            if(!$mapeiaArquivoPonto->update($request->all())){
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
     *     path="/v1/mapeia-arquivo-ponto/{id}",
     *     tags={"MapeiaArquivosPontos"},
     *     summary="Deleta um mapeamento do arquivo de ponto.",
     *     description="Deleta um mapeamento do arquivo de ponto.",
     *     operationId="mapeia_arquivo_ponto_delete",
     *     security={{"passport": {"*"}}},
     *     @OA\Parameter(
     *         name="id",
     *         in="path",
     *         description="ID do mapeamento do arquivo de ponto para deletar",
     *         required=true,
     *         @OA\Schema(
     *             type="integer",
     *             format="int64"
     *         )
     *     ),
     *     @OA\Response(
     *       @OA\MediaType(mediaType="application/json"),
     *       response=200,
     *       description="Mapeamento do arquivo de ponto excluído"
     *     ),
     *     @OA\Response(
     *       @OA\MediaType(mediaType="application/json"),
     *       response="401",
     *       description="Não autorizado. "
     *     ),
     *     @OA\Response(
     *         response="404",
     *         description="Mapeamento do arquivo de ponto não cadastrado na base dados. "
     *     )
     * )
     * @param int $mapeiaArquivoPontoId
     * @return JsonResponse
     */
    public function destroy(int $mapeiaArquivoPontoId)
    {
        try {
            DB::beginTransaction();
            $mapeiaArquivoPonto = MapeiaArquivoPonto::find($mapeiaArquivoPontoId);

            if (is_null($mapeiaArquivoPonto)){
                DB::rollBack();
                return response()->json(['message' => __('geral.geral_nao_encontrado')], 404);
            }

            if($mapeiaArquivoPonto->delete()){
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
            'coluna_arquivo' => 'required|string',
            'coluna_banco_dados' => 'required|string',
            'cliente_id' => 'required|integer|exists:clientes,id',
        ]);
    }
}
