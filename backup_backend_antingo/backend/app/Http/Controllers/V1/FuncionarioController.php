<?php

namespace App\Http\Controllers\V1;

use Exception;
use App\Http\Controllers\Controller;
use App\Models\Funcionario;
use App\Models\Exame;
use App\Models\Certificado;
use App\Models\Cargo;
use App\Models\FuncionarioCertificado;
use App\Models\FuncionarioExame;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use Spatie\QueryBuilder\AllowedFilter;
use Spatie\QueryBuilder\QueryBuilder;
use Illuminate\Support\Facades\DB;

use Illuminate\Validation\Rule;

class FuncionarioController extends Controller
{
    /**
     * @OA\Get(
     *   path="/v1/funcionarios",
     *   tags={"Funcionarios"},
     *   summary="Retorna os funcionários cadastrados",
     *   description="Retorna todos funcionários relacionando aos exames, certificados e cargos de acordo com os parâmetros.",
     *   operationId="funcionario_index",
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
     *     description="Lista de funcionarios"
     *   ),
     *   @OA\Response(
     *     @OA\MediaType(mediaType="application/json"),
     *     response=204,
     *     description="Nenhum funcionário encontrado"
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
    public function index(Request $request)
    {
        if($request->per_page === 'all') {
            $funcionarios = Funcionario::with('certificados')->orderBy('nome')->with('exames')->get();
        } else {
            $funcionarios = Funcionario::with('certificados')->orderBy('nome')->with('exames')->paginate(self::getPageNumber($request));
        }

        if (is_null($funcionarios)){
            return response()->json([], 204);
        }

        return response()->json($funcionarios);
    }

    /**
     * @OA\Post(
     *     path="/v1/funcionario",
     *     tags={"Funcionarios"},
     *     summary="Cadastra um funcionario no banco",
     *     description="Exemplo de como cadastrar funcionario via API",
     *     operationId="funcionario_register",
     *     security={{"passport": {"*"}}},
     *     @OA\RequestBody(
     *         @OA\MediaType(
     *             mediaType="application/json",
     *             @OA\Schema(
     *                 required={
     *                      "cargo_id",
     *                      "nome",
     *                      "data_admissao",
     *                      "salario",
     *                      "dia_pagamento",
     *                      "cpf",
     *                      "status"
     *                 },
     *                 @OA\Property(
     *                     property="nome",
     *                     type="string"
     *                 ),
     *                  @OA\Property(
     *                     property="data_admissao",
     *                     type="string"
     *                 ),
     *                  @OA\Property(
     *                     property="data_demissao",
     *                     type="string"
     *                 ),
     *                  @OA\Property(
     *                     property="salario",
     *                     type="string"
     *                 ),
     *                  @OA\Property(
     *                     property="dia_pagamento",
     *                     type="string"
     *                 ),
     *                  @OA\Property(
     *                     property="rg",
     *                     type="string"
     *                 ),
     *                  @OA\Property(
     *                     property="cpf",
     *                     type="string"
     *                 ),
     *                  @OA\Property(
     *                     property="ctps",
     *                     type="string"
     *                 ),
     *                  @OA\Property(
     *                     property="telefone_fixo",
     *                     type="string"
     *                 ),
     *                  @OA\Property(
     *                     property="celular",
     *                     type="string"
     *                 ),
     *                  @OA\Property(
     *                     property="pis",
     *                     type="string"
     *                 ),
     *                  @OA\Property(
     *                     property="status",
     *                     type="string"
     *                 ),
     *                  @OA\Property(
     *                     property="cargo_id",
     *                     type="number"
     *                 ),
     *                 @OA\Property(
     *                      property="certificados",
     *                      type="array",
     *                      @OA\Items(
     *                         @OA\Schema(
     *                             required={"certificado_id", "data_realizacao"},
     *                             @OA\Property(type="integer",property="certificado_id", description="ID do certificado, para vinculação de certificado (certificado_id)"),
     *                             @OA\Property(type="string",property="data_realizacao",description="Data de Realização"),
     *                         ),
     *                    ),
     *                 ),
     *                 @OA\Property(
     *                    property="exames",
     *                    type="array",
     *                    @OA\Items(
     *                         @OA\Schema(
     *                             required={"exame_id", "data_realizacao"},
     *                             @OA\Property(type="integer",property="exame_id", description="ID do exame, para vinculação de exames"),
     *                             @OA\Property(type="string",property="data_realizacao",description="Data de Realização"),
     *                         ),
     *                    ),
     *                 ),
     *                 example={
     *                   "nome": "Nome do Usuário de Teste",
     *                   "data_admissao": "1995-06-20 19:37:34",
     *                   "data_demissao": "1999-11-03 05:43:13",
     *                   "salario": "3000.45",
     *                   "dia_pagamento": "02",
     *                   "rg": "86921715128595",
     *                   "cpf": "60152112131",
     *                   "ctps": "23108249",
     *                   "telefone_fixo": "121542382750",
     *                   "celular": "985886643668",
     *                   "pis": "21569634766",
     *                   "status": "ativo",
     *                   "cargo_id": 8,
     *                   "matricula": "421",
     *                   "email": "umemail@funcionario.com",
     *                   "apelido": "apelido do funcionário",
     *                   "certificados": {
     *                      {
     *                          "certificado_id": "11",
     *                          "data_realizacao": "1999-11-03",
     *                      },
     *                      {
     *                          "certificado_id": "12",
     *                          "data_realizacao": "1999-11-03",
     *                      }
     *                   },
     *                   "exames": {
     *                      {
     *                          "exame_id": "11",
     *                          "data_realizacao": "1999-11-03",
     *                      },
     *                      {
     *                          "exame_id": "10",
     *                          "data_realizacao": "1999-11-03",
     *                      }
     *                   }
     *                  }
     *             )
     *         )
     *     ),
     *     @OA\Response(
     *         response="201",
     *         description="Operação realizada com sucesso"
     *     ),
     *     @OA\Response(
     *         response="400",
     *         description="Funcionário não encontrado"
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

            $funcionario = Funcionario::create($request->all());

            if(isset($request['certificados'])){
                $funcionario->certificados()->attach($request['certificados']);
            }

            if(isset($request['exames'])){
                $funcionario->exames()->attach($request['exames']);
            }

            DB::commit();

            return response()->json(compact('funcionario'), 201);

        } catch(Exception $exception) {
            DB::rollBack();
            return response()->json(['message' => self::MESSAGE_HTTP_ERROR_500], 500);
        }
    }

    /**
     * @OA\Get(
     *     path="/v1/funcionario/{id}",
     *     tags={"Funcionarios"},
     *     summary="Retorna um funcionario via id cadastrado no banco de dados",
     *     description="Retorna um funcionario via id",
     *     operationId="funcionario_show",
     *     security={{"passport": {"*"}}},
     *     @OA\Parameter(
     *         name="id",
     *         in="path",
     *         description="ID of funcionario to return",
     *         required=true,
     *         @OA\Schema(
     *             type="integer",
     *             format="int64"
     *         )
     *     ),
     *     @OA\Response(
     *       @OA\MediaType(mediaType="application/json"),
     *       response=200,
     *       description="Retorna um Funcionario"
     *     ),
     *     @OA\Response(
     *       @OA\MediaType(mediaType="application/json"),
     *       response="401",
     *       description="Não autorizado. "
     *     ),
     *     @OA\Response(
     *       @OA\MediaType(mediaType="application/json"),
     *       response="404",
     *       description="Funcionário não encontrado"
     *     )
     * )
     * @param int $funcionarioId
     * @return JsonResponse
     */
    public function show(Request $request, int $funcionarioId)
    {
        try {
            $funcionario = Funcionario::where('id', $funcionarioId)->with('certificados')->with('exames')->first();

            if (is_null($funcionario) || empty($funcionario)) {
                return response()->json(['message' => __('funcionarios.funcionario_nao_encontrado')], 404);
            }

            return response()->json(compact('funcionario'));

        } catch (Exception $exception) {
            return response()->json(['message' => self::MESSAGE_HTTP_ERROR_500], 500);
        }
    }

    /**
     * @OA\Put(
     *     path="/v1/funcionario/{id}",
     *     tags={"Funcionarios"},
     *     summary="Atualiza um Funcionário no banco",
     *     description="Exemplo de como atualizar um(a) fincionario(a) via API",
     *     operationId="funcionario_update",
     *     security={{"passport": {"*"}}},
     *       @OA\Parameter(
     *           name="id",
     *           in="path",
     *           description="ID of funcionario to return",
     *           required=true,
     *           @OA\Schema(
     *               type="integer",
     *               format="int64"
     *           )
     *       ),
     *       @OA\RequestBody(
     *         @OA\MediaType(
     *             mediaType="application/json",
     *             @OA\Schema(
     *                 required={
     *                      "cargo_id",
     *                      "nome",
     *                      "data_admissao",
     *                      "salario",
     *                      "dia_pagamento",
     *                      "cpf",
     *                      "status"
     *                 },
     *                 @OA\Property(
     *                     property="nome",
     *                     type="string"
     *                 ),
     *                  @OA\Property(
     *                     property="data_admissao",
     *                     type="string"
     *                 ),
     *                  @OA\Property(
     *                     property="data_demissao",
     *                     type="string"
     *                 ),
     *                  @OA\Property(
     *                     property="salario",
     *                     type="string"
     *                 ),
     *                  @OA\Property(
     *                     property="dia_pagamento",
     *                     type="string"
     *                 ),
     *                  @OA\Property(
     *                     property="rg",
     *                     type="string"
     *                 ),
     *                  @OA\Property(
     *                     property="cpf",
     *                     type="string"
     *                 ),
     *                  @OA\Property(
     *                     property="ctps",
     *                     type="string"
     *                 ),
     *                  @OA\Property(
     *                     property="telefone_fixo",
     *                     type="string"
     *                 ),
     *                  @OA\Property(
     *                     property="celular",
     *                     type="string"
     *                 ),
     *                  @OA\Property(
     *                     property="pis",
     *                     type="string"
     *                 ),
     *                 @OA\Property(
     *                     property="status",
     *                     type="string"
     *                 ),
     *                 @OA\Property(
     *                     property="cargo_id",
     *                     type="integer",
     *                     format="int64"
     *                 ),
     *                 @OA\Property(
     *                     property="matricula",
     *                     type="string"
     *                 ),
     *                 @OA\Property(
     *                     property="email",
     *                     type="string"
     *                 ),
     *                 @OA\Property(
     *                     property="apelido",
     *                     type="string"
     *                 ),
     *                 @OA\Property(
     *                      property="certificados",
     *                      type="array",
     *                      @OA\Items(
     *                         @OA\Schema(
     *                             required={"certificado_id", "data_realizacao"},
     *                             @OA\Property(type="integer",property="certificado_id", description="ID do certificado, para vinculação de certificado (certificado_id)"),
     *                             @OA\Property(type="string",property="data_realizacao",description="Data de Realização"),
     *                         ),
     *                    ),
     *                 ),
     *                 @OA\Property(
     *                    property="exames",
     *                    type="array",
     *                    @OA\Items(
     *                         @OA\Schema(
     *                             required={"exame_id", "data_realizacao"},
     *                             @OA\Property(type="integer",property="exame_id", description="ID do exame, para vinculação de exames"),
     *                             @OA\Property(type="string",property="data_realizacao",description="Data de Realização"),
     *                         ),
     *                    ),
     *                 ),
     *                 example={
     *                  "nome": "Usuário Teste",
     *                  "data_admissao": "1995-06-20",
     *                  "data_demissao": "1999-11-03",
     *                  "salario": "12345.45",
     *                  "dia_pagamento": "12",
     *                  "rg": "86921715128595",
     *                  "cpf": "58524412066",
     *                  "ctps": "15108249",
     *                  "telefone_fixo": "801582750",
     *                  "celular": "9858866436",
     *                  "pis": "21569634766",
     *                  "status": "ativo",
     *                  "cargo_id": 12,
     *                  "matricula": "8312",
     *                  "email": "email@funcionario.com",
     *                  "apelido": "apelido",
     *                  "certificados": {
     *                      {
     *                          "certificado_id": "11",
     *                          "data_realizacao": "1999-11-03",
     *                      },
     *                      {
     *                          "certificado_id": "12",
     *                          "data_realizacao": "1999-11-03",
     *                      }
     *                  },
     *                  "exames": {
     *                      {
     *                          "exame_id": "11",
     *                          "data_realizacao": "1999-11-03",
     *                      },
     *                      {
     *                          "exame_id": "10",
     *                          "data_realizacao": "1999-11-03",
     *                      }
     *                  }
     *                }
     *             )
     *         )
     *     ),
     *     @OA\Response(
     *         response="200",
     *         description="successful operation"
     *     ),
     *     @OA\Response(
     *         response="400",
     *         description="Erro"
     *     ),
     *     @OA\Response(
     *         response="401",
     *         description="Não autorizado"
     *     ),
     *     @OA\Response(
     *         response="404",
     *         description="Funcionário não encontrado"
     *     )
     * )
     * @param Request $request
     * @param int $funcionarioId
     * @return JsonResponse
     */
    public function update(Request $request, int $funcionarioId)
    {
        try {
            DB::beginTransaction();

            $funcionario = Funcionario::find($funcionarioId);

            if (is_null($funcionario)){
                DB::rollBack();
                return response()->json(['message' => __('funcionarios.funcionario_nao_encontrado')], 404);
            }

            $validacao = $this->isValid($this->sanitize($request));

            if ($validacao->fails()) {
                DB::rollBack();
                return response()->json(['message' => $validacao->errors()], 400);
            }

            if(!$funcionario->update($request->all())){
                DB::rollBack();
                return response()->json(['message' => __('funcionarios.funcionario_atualizado_erro')], 400);
            }

            if(isset($request['certificados'])){
                $funcionario->certificados()->sync($request['certificados'], true);
            }

            if(isset($request['exames'])){
                $funcionario->exames()->sync($request['exames'], true);
            }

            DB::commit();
            return response()->json(['message' => __('funcionarios.funcionario_atualizado_sucesso')], 200);

        } catch (Exception $exception) {
            DB::rollBack();
            return response()->json(['message' => self::MESSAGE_HTTP_ERROR_500], 500);
        }
    }

    /**
     * Remove the specified resource from storage.
     *
     * @OA\Delete(
     *     path="/v1/funcionario/{id}",
     *     tags={"Funcionarios"},
     *     summary="Deleta um funcionario.",
     *     description="Deleta um funcionario.",
     *     operationId="funcionario_delete",
     *     security={{"passport": {"*"}}},
     *     @OA\Parameter(
     *         name="id",
     *         in="path",
     *         description="ID do funcionario para deletar",
     *         required=true,
     *         @OA\Schema(
     *             type="integer",
     *             format="int64"
     *         )
     *     ),
     *     @OA\Response(
     *       @OA\MediaType(mediaType="application/json"),
     *       response=204,
     *       description="Funcionario excluído"
     *     ),
     *     @OA\Response(
     *       @OA\MediaType(mediaType="application/json"),
     *       response="401",
     *       description="Não autorizado. "
     *     ),
     *     @OA\Response(
     *         response="424",
     *         description="Funcionario não cadastrado na base dados. "
     *     )
     * )
     * @param int $funcionarioId
     * @return JsonResponse
     */
    public function destroy(int $funcionarioId)
    {
        try {
            DB::beginTransaction();
            $funcionario = Funcionario::find($funcionarioId);

            if (is_null($funcionario)){
                DB::rollBack();
                return response()->json(['message' => __('funcionarios.funcionario_nao_encontrado')], 424);
            }

            if($funcionario->delete()){
                DB::commit();
                return response()->json(['message' => __('funcionarios.funcionario_excluido_sucesso')], 200);
            }
            DB::commit();
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
     *     path="/v1/funcionario/search",
     *     tags={"Funcionarios"},
     *     summary="Pesquisa funcionarios.",
     *     description="Pesquisa funcionarios.",
     *     operationId="funcionario_search",
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
     *         name="filter[nome]",
     *         in="query",
     *         description="Nome do funcionario a ser pesquisado",
     *         required=false,
     *         @OA\Schema(
     *             type="string",
     *             format="text"
     *         )
     *     ),
     *     @OA\Parameter(
     *         name="filter[dia_pagamento]",
     *         in="query",
     *         description="Dia de pagamento do funcionario a ser pesquisado",
     *         required=false,
     *         @OA\Schema(
     *             type="string",
     *             format="text"
     *         )
     *     ),
     *     @OA\Parameter(
     *         name="filter[cpf]",
     *         in="query",
     *         description="CPF do funcionario a ser pesquisado",
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
        $funcionarios = QueryBuilder::for(Funcionario::class)
            ->allowedFilters(['nome', 'dia_pagamento', AllowedFilter::exact('cpf')])
            ->defaultSort('nome')
            ->paginate($perPage)
            ->appends($request->query());

        if ( count( $funcionarios ) == 0){
            return response()->json([], 204);
        }

        return response()->json(compact('funcionarios'));
    }

    /**
     * Sanitize fields
     * @param Request $request
     * @throws Request
     */
    private function sanitize(Request $request)
    {
        $input = $request->all();

        if(isset($input['cpf'])){
            $input['cpf'] = preg_replace('/[^0-9]/is', '', $input['cpf']);
        }
        if(isset($input['ctps'])){
            $input['ctps'] = preg_replace('/[^0-9]/is', '', $input['ctps']);
        }
        if(isset($input['telefone_fixo'])){
            $input['telefone_fixo'] = preg_replace('/[^0-9]/is', '', $input['telefone_fixo']);
        }
        if(isset($input['celular'])){
            $input['celular'] = preg_replace('/[^0-9]/is', '', $input['celular']);
        }

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
            'nome'              => 'required',
            'data_admissao'     => 'required',
            'data_demissao'     => 'nullable',
            'salario'           => 'required',
            'dia_pagamento'     => 'required',
            'rg'                => 'nullable|max:14',
            'cpf'               => [
                'regex:/^[0-9]+$/',
                'required',
                'max:11',
                Rule::unique('funcionarios')->ignore($request->id),
            ],
            'ctps'              => 'regex:/^[0-9]+$/|nullable|max:11',
            'telefone_fixo'     => 'nullable|max:14',
            'celular'           => 'nullable|max:15',
            'pis'               => 'nullable|max:11',
            'status'            => 'required',
            'cargo_id'          => 'required',
            'update'            => 'nullable',
            'data'              => 'nullable',
            'matricula'         => 'nullable',
            'email'             => 'nullable',
            'apelido'           => 'nullable'
        ]);
    }
}
