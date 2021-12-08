<?php

// use http\Client\Request;
use Illuminate\Support\Facades\Route;
use Illuminate\Http\Request;

Route::get('/debug-sentry', function () {
    throw new Exception('Send test Sentry error!');
});

Route::get('storage', function(){
    return Storage::disk('minio')->files();
});

// API home
Route::get('/v1', function () {
    return response()->json(['message' => 'Bem vindo à SisGO API V1. '], 200);
})->name('home');

// Autenticação
Route::post('v1/cadastrar', 'V1\UserController@register');

//Busca por uma tabela e
Route::prefix('v1/labels')->group(function () {
    Route::get('/{table}/{collumn}', 'V1\UserController@labels');
});

Route::group(['middleware' => 'auth:api', 'prefix' => 'v1'], function () {
    // Check Auth
    Route::get('/user', function (Request $request) {
        return $request->user();
    });

    // Usuarios
    Route::get('/user', function (Request $request) {
        return $request->user();
    });

    Route::get('usuarios', 'V1\UserController@index');
    Route::prefix('usuario')->group(function () {
        Route::post('/', 'V1\UserController@store');
        Route::get('/{id}', 'V1\UserController@show');
        Route::get('/search', 'V1\UserController@search');
        Route::put('{id}', 'V1\UserController@update');
        Route::delete('{id}', 'V1\UserController@destroy');
    });

    // Clientes
    Route::get('clientes', 'V1\ClienteController@index');
    Route::prefix('cliente')->group(function () {
        Route::post('/', 'V1\ClienteController@store');
        Route::get('{id}', 'V1\ClienteController@show');
        Route::get('/search', 'V1\ClienteController@search');
        Route::post('{id}', 'V1\ClienteController@update');
        Route::delete('{id}', 'V1\ClienteController@destroy');
    });

    // Jornadas
    Route::get('jornadas', 'V1\JornadaController@index');
    Route::prefix('jornada')->group(function () {
        Route::post('/', 'V1\JornadaController@store');
        Route::get('{id}', 'V1\JornadaController@show');
        Route::put('{id}', 'V1\JornadaController@update');
        Route::delete('{id}', 'V1\JornadaController@destroy');
    });

    // Projetos
    Route::get('projetos', 'V1\ProjetoController@index');
    Route::prefix('projeto')->group(function () {
        Route::post('/', 'V1\ProjetoController@store');
        Route::get('{id}', 'V1\ProjetoController@show');
        Route::get('/search', 'V1\ProjetoController@search');
        Route::put('{id}', 'V1\ProjetoController@update');
        Route::delete('{id}', 'V1\ProjetoController@destroy');
    });

    // Tipos de Atividades
    Route::get('tipos-atividades', 'V1\TipoAtividadeController@index');
    Route::prefix('tipo-atividade')->group(function () {
        Route::post('/', 'V1\TipoAtividadeController@store');
        Route::get('{id}', 'V1\TipoAtividadeController@show');
        Route::get('/search', 'V1\TipoAtividadeController@search');
        Route::put('{id}', 'V1\TipoAtividadeController@update');
        Route::delete('{id}', 'V1\TipoAtividadeController@destroy');
    });

    // Funcionarios
    Route::get('funcionarios', 'V1\FuncionarioController@index');
    Route::prefix('funcionario')->group(function () {
        Route::post('/', 'V1\FuncionarioController@store');
        Route::get('{id}', 'V1\FuncionarioController@show');
        Route::get('/search', 'V1\FuncionarioController@search');
        Route::put('{id}', 'V1\FuncionarioController@update');
        Route::delete('{id}', 'V1\FuncionarioController@destroy');
    });

    // Exames
    Route::get('exames', 'V1\ExameController@index');
    Route::prefix('exame')->group(function () {
        Route::post('/', 'V1\ExameController@store');
        Route::get('{id}', 'V1\ExameController@show');
        Route::get('/search', 'V1\ExameController@search');
        Route::put('{id}', 'V1\ExameController@update');
        Route::delete('{id}', 'V1\ExameController@destroy');
    });

    // Certificados
    Route::get('certificados', 'V1\CertificadoController@index');
    Route::prefix('certificado')->group(function () {
        Route::post('/', 'V1\CertificadoController@store');
        Route::get('{id}', 'V1\CertificadoController@show');
        Route::get('/search', 'V1\CertificadoController@search');
        Route::get('/situacoes', 'V1\CertificadoController@situacoes');
        Route::put('{id}', 'V1\CertificadoController@update');
        Route::delete('{id}', 'V1\CertificadoController@destroy');
    });

    // Cargos
    Route::get('cargos', 'V1\CargoController@index');
    Route::prefix('cargo')->group(function () {
        Route::post('/', 'V1\CargoController@store');
        Route::get('{id}', 'V1\CargoController@show');
        Route::get('/search', 'V1\CargoController@search');
        Route::put('{id}', 'V1\CargoController@update');
        Route::delete('{id}', 'V1\CargoController@destroy');
    });

    // Tipos de Recursos
    Route::get('tipos-recursos', 'V1\TipoRecursoController@index');
    Route::prefix('tipo-recurso')->group(function () {
        Route::post('/', 'V1\TipoRecursoController@store');
        Route::get('{id}', 'V1\TipoRecursoController@show');
        Route::get('/search', 'V1\TipoRecursoController@search');
        Route::put('{id}', 'V1\TipoRecursoController@update');
        Route::delete('{id}', 'V1\TipoRecursoController@destroy');
    });

    // Tarifas
    Route::get('tarifas', 'V1\TarifaController@index');
    Route::prefix('tarifa')->group(function () {
        Route::post('/', 'V1\TarifaController@store');
        Route::get('{id}', 'V1\TarifaController@show');
        Route::get('/search', 'V1\TarifaController@search');
        Route::put('{id}', 'V1\TarifaController@update');
        Route::delete('{id}', 'V1\TarifaController@destroy');
    });

    // Equipamentos
    Route::get('equipamentos', 'V1\EquipamentoController@index');
    Route::prefix('equipamento')->group(function () {
        Route::post('/', 'V1\EquipamentoController@store');
        Route::get('{id}', 'V1\EquipamentoController@show');
        Route::get('/search', 'V1\EquipamentoController@search');
        Route::put('{id}', 'V1\EquipamentoController@update');
        Route::delete('{id}', 'V1\EquipamentoController@destroy');
    });

    // Tarifas Preços
    Route::get('tarifas-precos', 'V1\TarifaPrecoController@index');
    Route::prefix('tarifa-preco')->group(function () {
        Route::post('/', 'V1\TarifaPrecoController@store');
        Route::get('{id}', 'V1\TarifaPrecoController@show');
        Route::put('{id}', 'V1\TarifaPrecoController@update');
        Route::delete('{id}', 'V1\TarifaPrecoController@destroy');
    });

    // Tipos de Faturamentos
    Route::get('tipos-faturamentos', 'V1\TipoFaturamentoController@index');
    Route::prefix('tipo-faturamento')->group(function () {
        Route::post('/', 'V1\TipoFaturamentoController@store');
        Route::get('{id}', 'V1\TipoFaturamentoController@show');
        Route::get('/search', 'V1\TipoFaturamentoController@search');
        Route::put('{id}', 'V1\TipoFaturamentoController@update');
        Route::delete('{id}', 'V1\TipoFaturamentoController@destroy');
    });

    // Atividades
    Route::get('atividades', 'V1\AtividadeController@index');
    Route::prefix('atividade')->group(function () {
        Route::post('/', 'V1\AtividadeController@store');
        Route::get('{id}', 'V1\AtividadeController@show');
        Route::get('/search', 'V1\AtividadeController@search');
        Route::put('{id}', 'V1\AtividadeController@update');
        Route::delete('{id}', 'V1\AtividadeController@destroy');
    });

    // Pontos Marcações
    Route::get('pontos-marcacoes', 'V1\PontoMarcacaoController@index');
    Route::prefix('ponto-marcacao')->group(function () {
        Route::post('/', 'V1\PontoMarcacaoController@store');
        Route::post('/importaCsv', 'V1\PontoMarcacaoController@importaCsv');
        Route::get('{id}', 'V1\PontoMarcacaoController@show');
        Route::get('/search', 'V1\PontoMarcacaoController@search');
        Route::put('{id}', 'V1\PontoMarcacaoController@update');
        Route::delete('{id}', 'V1\PontoMarcacaoController@destroy');
    });

    // Mapeamento do arquivo de ponto
    Route::get('mapeia-arquivos-ponto', 'V1\MapeiaArquivoPontoController@index');
    Route::prefix('mapeia-arquivo-ponto')->group(function () {
        Route::post('/', 'V1\MapeiaArquivoPontoController@store');
        Route::get('{id}', 'V1\MapeiaArquivoPontoController@show');
        Route::get('/search', 'V1\MapeiaArquivoPontoController@search');
        Route::put('{id}', 'V1\MapeiaArquivoPontoController@update');
        Route::delete('{id}', 'V1\MapeiaArquivoPontoController@destroy');
    });
});
