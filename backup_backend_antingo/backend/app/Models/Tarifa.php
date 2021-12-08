<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

/**
 * Class Tarifa
 * @package App\Models
 * @OA\Schema(@OA\Xml(name="Tarifa"))
 */
class Tarifa extends Model
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
    private $descricao;

    /**
     * @var string[]
     */
    protected $fillable = [
        'descricao',
    ];

    /**
     * @return HasMany
     */
    public function tarifas_precos()
    {
        return $this->hasMany(TarifaPreco::class);
    }

    /**
     * @return HasMany
     */
    public function atividades()
    {
        return $this->hasMany(Atividade::class);
    }
}
