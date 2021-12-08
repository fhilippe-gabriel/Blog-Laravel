<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

/**
 * Class TipoFaturamento
 * @package App\Models
 * @OA\Schema(@OA\Xml(name="TipoFaturamento"))
 */
class TipoFaturamento extends Model
{
    
    /**
     * @var string
     */
    protected $table = 'tipos_faturamentos';

    /**
     * @OA\Property(format="int64")
     * @var int
     */
    private $id;

    /**
     * @var string
     * @OA\Property(format="256")
     */
    private $descricao;

    /**
     * @var string
     * @OA\Property(format="256")
     */
    private $observacao;

    /**
     * @var string[]
     */
    protected $fillable = [
        'descricao',
        'observacao'
    ];

    /**
     * @return HasMany
     */
    public function atividades()
    {
        return $this->hasMany(Atividade::class);
    }
}
