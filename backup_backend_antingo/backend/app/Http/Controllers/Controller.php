<?php

namespace App\Http\Controllers;

use Illuminate\Foundation\Auth\Access\AuthorizesRequests;
use Illuminate\Foundation\Bus\DispatchesJobs;
use Illuminate\Foundation\Validation\ValidatesRequests;
use Illuminate\Http\Request;
use Illuminate\Routing\Controller as BaseController;
use Illuminate\Pagination\Paginator;

class Controller extends BaseController
{
    use AuthorizesRequests, DispatchesJobs, ValidatesRequests;

    const MESSAGE_HTTP_ERROR_500 = 'Desculpe, ocorreu um erro no servidor, por favor, tente novamente, mais tarde. ';

    protected function getPageNumber(Request $request): int {
        $perPage = $request ? $request['per_page'] : null;
        return $perPage > 10 ? $perPage : 10;
    }
}
