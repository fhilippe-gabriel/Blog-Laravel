<?php

namespace App\Http\Controllers\V1;

use App\Models\PontoMarcacao;
use App\Http\Controllers\Controller;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Exception;
use Illuminate\Support\Facades\Validator;
use Spatie\QueryBuilder\QueryBuilder;
use Spatie\QueryBuilder\AllowedFilter;
use Illuminate\Support\Facades\DB;
use Illuminate\Validation\Rule;
use Maatwebsite\Excel\Facades\Excel;
use Carbon\Carbon;
use DateTime;

use App\Imports\PontosMarcacoesImport;
// use Maatwebsite\Excel\Excel;

class PontoMarcacaoController extends Controller
{
    /**
     * Display a listing of the resource.
     *
     * @OA\Get(
     *   path="/v1/pontos-marcacoes",
     *   summary="Retorna as marcações de ponto.",
     *   description="Retorna as marcações de ponto",
     *   tags={"PontosMarcacoes"},
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
            $pontosMarcacoes = PontoMarcacao::all();
        } else {
            $pontosMarcacoes = PontoMarcacao::paginate(self::getPageNumber($request));
        }

        if (is_null($pontosMarcacoes)){
            return response()->json([], 204);
        }

        return response()->json($pontosMarcacoes);
    }

    /**
     * @OA\Post(
     *     path="/v1/ponto-marcacao",
     *     tags={"PontosMarcacoes"},
     *     summary="Cadastra uma nova marcação de monto.",
     *     description="Cadastra uma nova marcação de monto.",
     *     operationId="ponto_marcacao_register",
     *     security={{"passport": {"*"}}},
     *     @OA\RequestBody(
     *         @OA\MediaType(
     *             mediaType="application/json",
     *             @OA\Schema(
     *                 required={
     *                      "data_ponto",
     *                      "hora_entrada",
     *                      "hora_saida",
     *                      "quantidade_horas",
     *                      "funcionario_id"
     *                 },
     *                 @OA\Property(
     *                     property="hora_entrada",
     *                     type="string"
     *                 ),
     *                  @OA\Property(
     *                     property="hora_saida",
     *                     type="string"
     *                 ),
     *                  @OA\Property(
     *                     property="quantidade_horas",
     *                     type="integer"
     *                 ),
     *                  @OA\Property(
     *                     property="funcionario_id",
     *                     type="integer"
     *                 ),
     *                 example={
     *                     "data_ponto": "16/09/2020",
     *                     "hora_entrada": "07:30",
     *                     "hora_saida": "11:30",
     *                     "quantidade_horas": 4,
     *                     "funcionario_id": 1,
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

            $pontoMarcacao = PontoMarcacao::create($request->all());

            DB::commit();

            return response()->json(compact('pontoMarcacao'), 201);

        } catch (Exception $exception) {
            DB::rollBack();
            return response()->json(['message' => self::MESSAGE_HTTP_ERROR_500], 500);
        }
    }

    /**
     * @OA\Get(
     *     path="/v1/ponto-marcacao/{id}",
     *     tags={"PontosMarcacoes"},
     *     summary="Retorna uma marcação de ponto",
     *     description="Retorna uma marcação de ponto via id",
     *     operationId="ponto_marcacao_show",
     *     security={{"passport": {"*"}}},
     *     @OA\Parameter(
     *         name="id",
     *         in="path",
     *         description="ID of marcação de ponto to return",
     *         required=true,
     *         @OA\Schema(
     *             type="integer",
     *             format="int64"
     *         )
     *     ),
     *     @OA\Response(
     *       @OA\MediaType(mediaType="application/json"),
     *       response=200,
     *       description="Retorna uma marcação de ponto"
     *     ),
     *     @OA\Response(
     *       @OA\MediaType(mediaType="application/json"),
     *       response="401",
     *       description="Não autorizado. "
     *     ),
     *     @OA\Response(
     *       @OA\MediaType(mediaType="application/json"),
     *       response="404",
     *       description="Marcação de ponto não encontrada"
     *     )
     * )
     * @param int $funcionarioId
     * @return JsonResponse
     */
    public function show(int $pontoMarcacaoId)
    {
        try {
            $pontoMarcacao = PontoMarcacao::find($pontoMarcacaoId);

            if (is_null($pontoMarcacao))
                return response()->json(['message' => __('geral.geral_nao_encontrado')], 404);

            return response()->json(compact('pontoMarcacao'));

        } catch (Exception $exception) {
            return response()->json(['message' => self::MESSAGE_HTTP_ERROR_500], 500);
        }
    }

    /**
     * @OA\Put(
     *     path="/v1/ponto-marcacao/{id}",
     *     tags={"PontosMarcacoes"},
     *     summary="Atualiza uma marcação de ponto.",
     *     description="Atualiza uma marcação de ponto.",
     *     operationId="ponto_marcacao_update",
     *     security={{"passport": {"*"}}},
     *     @OA\Parameter(
     *         name="id",
     *         in="path",
     *         description="ID da marcação de ponto",
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
     *                      "data_ponto",
     *                      "hora_entrada",
     *                      "hora_saida",
     *                      "quantidade_horas",
     *                      "funcionario_id"
     *                 },
     *                 @OA\Property(
     *                     property="hora_entrada",
     *                     type="string"
     *                 ),
     *                  @OA\Property(
     *                     property="hora_saida",
     *                     type="string"
     *                 ),
     *                  @OA\Property(
     *                     property="quantidade_horas",
     *                     type="integer"
     *                 ),
     *                  @OA\Property(
     *                     property="funcionario_id",
     *                     type="integer"
     *                 ),
     *                 example={
     *                     "data_ponto": "15/09/2020",
     *                     "hora_entrada": "13:30",
     *                     "hora_saida": "18:30",
     *                     "quantidade_horas": 5,
     *                     "funcionario_id": 2,
     *                 }
     *             )
     *         )
     *     ),
     *     @OA\Response(
     *         response="200",
     *         description="Marcação de ponto atualizada"
     *     ),
     *     @OA\Response(
     *         response="400",
     *         description="Erro ao atualizar"
     *     ),
     *     @OA\Response(
     *         response="404",
     *         description="Marcação de ponto não encontrada"
     *     ),
     *     @OA\Response(
     *         response="401",
     *         description="Não autorizado"
     *     )
     * )
     * @param Request $request
     * @param int $pontoMarcacaoId
     * @return JsonResponse
     */
    public function update(Request $request, int $pontoMarcacaoId)
    {
        try {
            DB::beginTransaction();

            $pontoMarcacao = PontoMarcacao::find($pontoMarcacaoId);

            if (is_null($pontoMarcacao)){
                DB::rollBack();
                return response()->json(['message' => __('geral.geral_nao_encontrado')], 404);
            }

            $validacao = $this->isValid($this->sanitize($request));

            if ($validacao->fails()) {
                DB::rollBack();
                return response()->json(['message' => $validacao->errors()], 400);
            }

            $request->merge([
                'data_ponto' => Carbon::createFromFormat('d/m/Y', $request->data_ponto)->format('Y-m-d')
            ]);

            if(!$pontoMarcacao->update($request->all())){
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
     *     path="/v1/ponto-marcacao/{id}",
     *     tags={"PontosMarcacoes"},
     *     summary="Deleta uma marcação de ponto.",
     *     description="Deleta uma marcação de ponto.",
     *     operationId="ponto_marcacao_delete",
     *     security={{"passport": {"*"}}},
     *     @OA\Parameter(
     *         name="id",
     *         in="path",
     *         description="ID da marcação de ponto para deletar",
     *         required=true,
     *         @OA\Schema(
     *             type="integer",
     *             format="int64"
     *         )
     *     ),
     *     @OA\Response(
     *       @OA\MediaType(mediaType="application/json"),
     *       response=200,
     *       description="Marcação de ponto excluída"
     *     ),
     *     @OA\Response(
     *       @OA\MediaType(mediaType="application/json"),
     *       response="401",
     *       description="Não autorizado. "
     *     ),
     *     @OA\Response(
     *         response="404",
     *         description="Marcação não cadastrado na base dados. "
     *     )
     * )
     * @param int $pontoMarcacaoId
     * @return JsonResponse
     */
    public function destroy(int $pontoMarcacaoId)
    {
        try {
            DB::beginTransaction();
            $pontoMarcacao = PontoMarcacao::find($pontoMarcacaoId);

            if (is_null($pontoMarcacao)){
                DB::rollBack();
                return response()->json(['message' => __('geral.geral_nao_encontrado')], 404);
            }

            if($pontoMarcacao->delete()){
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
     *     path="/v1/ponto-marcacao/search",
     *     tags={"PontosMarcacoes"},
     *     summary="Pesquisa marcações de ponto de um funcionário.",
     *     description="Pesquisa marcações de ponto de um funcionário.",
     *     operationId="ponto_marcacao_search",
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
     *         name="filter[funcionario_id]",
     *         in="query",
     *         description="Id do funcionário a buscar as marcações de ponto",
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
        $pontosMarcacoes = QueryBuilder::for(PontoMarcacao::class)
            ->allowedFilters([ AllowedFilter::exact('funcionario_id')])
            ->allowedSorts('funcionario_id')
            ->paginate($perPage)
            ->appends($request->query());

        if ( count( $pontosMarcacoes ) == 0){
            return response()->json([], 204);
        }

        return response()->json(compact('pontosMarcacoes'));
    }

    /**
     * @OA\Post(
     *     path="/v1/ponto-marcacao/importaCsv",
     *     tags={"PontosMarcacoes"},
     *     summary="Importa um arquivo CSV com os pontos registrados dos funcionários",
     *     description="Exemplo de como importar um arquivo CSV",
     *     operationId="ponto_marcacao_importa_csv",
     *     security={{"passport": {"*"}}},
     *     @OA\RequestBody(
     *         @OA\MediaType(
     *             mediaType="multipart/form-data",
     *             @OA\Schema(
     *                  @OA\Property(
     *                     property="cliente_id",
     *                     type="integer",
     *                 ),
     *                  @OA\Property(
     *                     property="csv_file",
     *                     type="file",
     *                 ),
     *                 example={
     *                     "cliente_id": 1,
     *                     "csv_file": "Arquivo CSV",
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
     *         description="Importação realizada mas aconteceram alguns erros no processamento"
     *     ),
     *     @OA\Response(
     *         response="401",
     *         description="Não autorizado"
     *     )
     * )
     * @param Request $request
     * @return JsonResponse
     */
    public function importaCsv(Request $request)
    {   
        try {
            DB::beginTransaction();

            //validações específicas para o upload do arquivo: se é csv (caso não informe, na validação, a opção txt a validação falha). valida também se o cliente_id foi informado
            $validacao = Validator::make(
                $request->all(),
                [
                    'csv_file' => 'required|mimes:csv,txt',
                    'cliente_id' => 'required|integer'
                ],
                [
                    'cliente_id.required' => 'Cliente não informado',
                    'csv_file.required' => 'O arquivo CSV é obrigatório',
                    'csv_file.mimes' => 'O arquivo deve ser no formato CSV'
                ]
            );

            if ($validacao->fails()) {
                DB::rollBack();
                return response()->json(['message' => $validacao->errors()], 400);
            }

            if ($files = $request->file('csv_file')) {
                $extension = $request->file('csv_file')->getClientOriginalExtension();
                $filename = uniqid().'.'.$extension; 

                $file = $request->file('csv_file')->storeAs(
                    $request->cliente_id . '/csv' , $filename, 'public'
                );
            }
            if(!$file){
                return response()->json(['message' => 'Erro no processamento do arquivo de horários.'], 400);
            }
            
            $importacao = new PontosMarcacoesImport;
            Excel::import($importacao, $file, 'public', \Maatwebsite\Excel\Excel::CSV);
            

            DB::commit();
            $log = count($importacao->getLog());

            if(!$importacao->getHouveInsercao()){
                return response()->json(['message' => 'Nenhuma importação realizada. Confira o log: ', 'log' => json_encode($importacao->getLog()), 'cliente_id' => $request->cliente_id], 201);
            }

            if($log  > 0){
                return response()->json(['message' => 'Importação realizada mas com alguns problemas. Confira o log: ', 'log' => json_encode($importacao->getLog()), 'cliente_id' => $request->cliente_id], 201);
            }
            
            return response()->json(['message' => 'Importação realizada com sucesso.'], 201);

        } catch (Exception $exception) {
            DB::rollBack();
            if($exception->getCode() == 500){
                return response()->json(['message' => self::MESSAGE_HTTP_ERROR_500], 500);
            }else{
                return response()->json(['message' => $exception->getMessage()], $exception->getCode());
            }
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
            'data_ponto' => 'required',
            'hora_entrada' => 'required|date_format:H:i',
            'hora_saida' => 'required|date_format:H:i|after:hora_entrada',
            'quantidade_horas' => 'required|integer',
            'funcionario_id' => 'required|integer|exists:funcionarios,id',
        ]);
    }
}
