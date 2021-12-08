<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

/**
 * Class TipoRecurso
 * @package App\Models
 * @OA\Schema(@OA\Xml(name="TipoRecurso"))
 */
class TipoRecurso extends Model
{
    /**
     * @var string
     */
    protected $table = 'tipos_recursos';

    /**
     * @OA\Property(format="int64")
     * @var int
     */
    private $id;

    /**
     * @var integer
     * @OA\Property(format="int64")
     */
    private $numero;

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
        'numero',
        'descricao',
        'observacao'
    ];

    /**
     * @return HasMany
     */
    public function equipamentos()
    {
        return $this->hasMany(Equipamento::class);
    }

    /**
     * @return HasMany
     */
    public function tarifas_precos()
    {
        return $this->hasMany(TarifaPreco::class);
    }
}
