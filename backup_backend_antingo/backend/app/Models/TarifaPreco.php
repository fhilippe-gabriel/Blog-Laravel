<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

/**
 * Class TarifaPreco
 * @package App\Models
 * @OA\Schema(@OA\Xml(name="TarifaPreco"))
 */
class TarifaPreco extends Model
{
    protected $table = 'tarifas_precos';
    /**
     * @OA\Property(format="int64")
     * @var int
     */
    private $id;

    /**
     * @var string
     * @OA\Property(format="float")
     */
    private $valor;

    /**
     * @var integer
     * @OA\Property(format="int64")
     */
    private $tarifa_id;

    /**
     * @var integer
     * @OA\Property(format="int64")
     */
    private $tipo_recurso_id;

    /**
     * @var string
     * @OA\Property(format="256")
     */
    private $observacao;

    /**
     * @var string[]
     */
    protected $fillable = [
        'valor',
        'tarifa_id',
        'tipo_recurso_id',
        'observacao'
    ];

    /**
     * @return belongsTo
     */
    public function tarifas()
    {
        return $this->belongsTo(Tarifa::class,'tarifa_id');
    }

    /**
     * @return belongsTo
     */
    public function tiposRecursos()
    {
        return $this->belongsTo(TipoRecurso::class,'tipo_recurso_id');
    }
}
