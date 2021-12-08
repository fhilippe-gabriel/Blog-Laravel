<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

/**
 * Class Equipamento
 * @package App\Models
 * @OA\Schema(@OA\Xml(name="Equipamento"))
 */
class Equipamento extends Model
{
    /**
     * @OA\Property(format="int64")
     * @var int
     */
    private $id;

    /**
     * @var string
     * @OA\Property(format="256")
     */
    private $nome_recurso;

    /**
     * @var integer
     * @OA\Property(format="int64")
     */
    private $tipo_recurso_id;

    /**
     * @var string[]
     */
    protected $fillable = [
        'nome_recurso',
        'observacao',
        'tipo_recurso_id'
    ];

    /**
     * @return BelongsTo
     */
    public function tiposRecursos()
    {
        return $this->belongsTo(TipoRecurso::class,'tipo_recurso_id');
    }
}
