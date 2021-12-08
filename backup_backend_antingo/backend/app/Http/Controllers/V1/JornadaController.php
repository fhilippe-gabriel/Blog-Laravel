<?php

namespace App\Http\Controllers\V1;

use App\Models\Jornada;
use Exception;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use App\Http\Controllers\Controller;
use Illuminate\Support\Facades\Validator;


class JornadaController extends Controller
{

    /**
     * @OA\Get(
     *   path="/v1/jornadas",
     *   tags={"Jornadas"},
     *   summary="Retorna as jornadas cadastradas no banco",
     *   description="Retorna todas as jornadas cadastrados no banco",
     *   operationId="jornada_index",
     *   security={{"passport": {"*"}}},
     *   @OA\Response(
     *     @OA\MediaType(mediaType="application/json"),
     *     response=200,
     *     description="Lista de jornadas"
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
        try {
            $jornadas = Jornada::paginate(self::getPageNumber($request));

            if (is_null($jornadas)) {
                return response()->json([], 204);
            }

            return response()->json(compact('jornadas'));

        } catch (Exception $exception) {
            return response()->json(['message' => self::MESSAGE_HTTP_ERROR_500], 500);
        }
    }

    /**
     * @OA\Get(
     *     path="/v1/jornada/{id}",
     *     tags={"Jornadas"},
     *     summary="Retorna uma jornada via id cadastrada no banco",
     *     description="Retorna uma jornada via id",
     *     operationId="jornada_show",
     *     security={{"passport": {"*"}}},
     *     @OA\Parameter(
     *         name="id",
     *         in="path",
     *         description="ID of jornada to return",
     *         required=true,
     *         @OA\Schema(
     *             type="integer",
     *             format="int64"
     *         )
     *     ),
     *     @OA\Response(
     *       @OA\MediaType(mediaType="application/json"),
     *       response=200,
     *       description="Retorna uma Jornada"
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
     * @param int $clientId
     * @return JsonResponse
     **/

    public function show(int $clientId)
    {
        try {
            $jornada = Jornada::find($clientId);

            if (is_null($jornada)) {
                return response()->json(['message' => 'Jornada não encontrada.'], 404);
            }

            return response()->json(compact('jornada'));

        } catch (Exception $exception) {
            return response()->json(['message' => self::MESSAGE_HTTP_ERROR_500], 500);
        }
    }

    /**
     * @OA\Post(
     *     path="/v1/jornada",
     *     tags={"Jornadas"},
     *     summary="Cadastra um jornada no banco",
     *     description="Exemplo de como cadastrar jornada via API",
     *     operationId="jornada_register",
     *     security={{"passport": {"*"}}},
     *     @OA\RequestBody(
     *         @OA\MediaType(
     *             mediaType="application/json",
     *             @OA\Schema(
     *                 required={
     *                      "hora_inicio",
     *                      "hora_fim"
     *                 },
     *                 @OA\Property(
     *                     property="hora_inicio",
     *                     type="string"
     *                 ),
     *                  @OA\Property(
     *                     property="hora_fim",
     *                     type="string"
     *                 ),
     *                  @OA\Property(
     *                     property="percentual",
     *                     type="string"
     *                 ),
     *                  @OA\Property(
     *                     property="insalubridade",
     *                     type="string"
     *                 ),
     *                  @OA\Property(
     *                     property="periculosidade",
     *                     type="string"
     *                 ),
     *                 example={
     *                     "hora_inicio": "12:02",
     *                     "hora_fim": "09:16",
     *                     "percentual": "64",
     *                     "insalubridade": "24",
     *                     "periculosidade": "90",
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
     **/
    public function store(Request $request)
    {
        try {
            $request = $request->all();

            $validator = $this->validateInputRequest($request);

            if ($validator->fails()) {
                return response()->json(['message' => $validator->errors()], 400);
            }

            $jornada = Jornada::create($request);

            return response()->json(compact('jornada'), 201);

        } catch (Exception $exception) {
            return response()->json(['message' => self::MESSAGE_HTTP_ERROR_500], 500);
        }
    }

    /**
     * @OA\Put(
     *     path="/v1/jornada/{id}",
     *     tags={"Jornadas"},
     *     summary="Atualiza uma jornada no banco",
     *     description="Exemplo de como atualizar uma jornada via API",
     *     operationId="jornada_update",
     *     security={{"passport": {"*"}}},
     *     @OA\Parameter(
     *         name="id",
     *         in="path",
     *         description="ID of jornada to return",
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
     *                      "hora_inicio",
     *                      "hora_fim"
     *                 },
     *                 @OA\Property(
     *                     property="hora_inicio",
     *                     type="string"
     *                 ),
     *                  @OA\Property(
     *                     property="hora_fim",
     *                     type="string"
     *                 ),
     *                  @OA\Property(
     *                     property="percentual",
     *                     type="string"
     *                 ),
     *                  @OA\Property(
     *                     property="insalubridade",
     *                     type="string"
     *                 ),
     *                  @OA\Property(
     *                     property="periculosidade",
     *                     type="string"
     *                 ),
     *                 example={
     *                     "hora_inicio": "12:02",
     *                     "hora_fim": "09:16",
     *                     "percentual": "64",
     *                     "insalubridade": "24",
     *                     "periculosidade": "90",
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
     * @param int $jornadaId
     * @return JsonResponse
     */
    public function update(Request $request, int $jornadaId)
    {
        try {

            $jornada = Jornada::find($jornadaId);

            if (is_null($jornada)) {
                return response()->json(['message' => 'Jornada não encontrada. '], 404);
            }

            $request = $request->all();

            $validator = $this->validateInputRequest($request);

            if ($validator->fails()) {
                return response()->json(['message' => $validator->errors()], 400);
            }

            try {
                $jornada->update($request);
            } catch (Exception $exception) {
                return response()->json(['message' => 'Não foi possível atualizar o registro, verifique as informações e tente novamente.'],
                    400);
            }

            return response()->json(['message' => 'Os dados do jornada foram atualizados com sucesso. '], 200);

        } catch (Exception $exception) {
            return response()->json(['message' => self::MESSAGE_HTTP_ERROR_500], 500);
        }
    }

    /**
     * @OA\Delete(
     *     path="/v1/jornada/{id}",
     *     tags={"Jornadas"},
     *     summary="Deleta uma jornada via id",
     *     description="Deleta uma jornada via id",
     *     operationId="jornada_delete",
     *     security={{"passport": {"*"}}},
     *     @OA\Parameter(
     *         name="id",
     *         in="path",
     *         description="ID do jornada para deletar",
     *         required=true,
     *         @OA\Schema(
     *             type="integer",
     *             format="int64"
     *         )
     *     ),
     *     @OA\Response(
     *       @OA\MediaType(mediaType="application/json"),
     *       response=200,
     *       description="Jornada excluída"
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
     * @param int $jornadaId
     * @return JsonResponse
     */
    public function destroy(int $jornadaId)
    {
        try {

            $jornada = Jornada::find($jornadaId);

            if (is_null($jornada)) {
                return response()->json(['message' => 'Jornada não encontrada. '], 404);
            }

            $jornada->delete();

            return response()->json([], 204);

        } catch (Exception $exception) {
            return response()->json(['message' => self::MESSAGE_HTTP_ERROR_500], 500);
        }
    }

    private static function validateInputRequest(array $inputData)
    {
        return Validator::make($inputData, [
            'hora_inicio' => 'required|max:150',
            'hora_fim' => 'required|max:150',
            'percentual' => 'nullable|max:150',
            'insalubridade' => 'nullable|max:150',
            'periculosidade' => 'nullable|max:150',
        ]);
    }
}
