<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

/**
 * @OA\Schema(@OA\Xml(name="FuncionarioExame"))
 */
class FuncionarioExame extends Model
{
    protected $table = 'funcionarios_exames';

    /**
     * @OA\Property(format="int64")
     * @var int
     */
    private $id;

     /**
     * @OA\Property(format="256")
     * @var string
     */
    private $data_realizacao;

    protected $fillable = [
        'funcionario_id',
        'exame_id',
        'data_realizacao',
    ];

    /**
     * The attributes that should be hidden for arrays.
     *
     * @var array
     */
    protected $hidden = [];
}
