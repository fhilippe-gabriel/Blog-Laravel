<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\belongsToMany;

/**
 * @OA\Schema(@OA\Xml(name="Exame"))
 */
class Exame extends Model
{
    protected $table = 'exames';

    /**
     * @OA\Property(format="int64")
     * @var int
     */
    private $id;
    
    /**
     * @OA\Property(format="256")
     * @var string
     */
    private $nome_exame;

    /**
     * @OA\Property(format="256")
     * @var string
     */
    private $tipo_exame;
    
    /**
     * @OA\Property(format="256")
     * @var string
     */
    private $observacao;
    
    /**
     * @OA\Property(format="256")
     * @var string
     */
    private $validade_meses;

    protected $fillable = [
        'nome_exame',
        'tipo_exame',
        'observacao',
        'validade_meses',
    ];

    /**
     * The attributes that should be hidden for arrays.
     *
     * @var array
     */
    protected $hidden = [];

    /**
     * @return BelongsTo
     */
    public function funcionarios()
    {
        return $this->belongsToMany(Funcionario::class, 'funcionarios_exames', 'exame_id', 'funcionario_id')->withPivot('data_realizacao');
    }
}
