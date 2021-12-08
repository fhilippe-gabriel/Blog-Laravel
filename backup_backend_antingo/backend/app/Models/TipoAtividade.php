<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

/**
 * Class TipoAtividade
 * @package App\Models
 * @OA\Schema(@OA\Xml(name="TipoAtividade"))
 */
class TipoAtividade extends Model
{
    /**
     * @var string
     */
    protected $table = 'tipos_atividades';

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
     * @var boolean
     * @OA\Property(format="256")
     */
    private $deletavel;

    /**
     * @var string[]
     */
    protected $fillable = [
        'numero',
        'descricao',
        'observacao',
        'deletavel'
    ];

    /**
     * The attributes that should be cast.
     *
     * @var array
     */
    protected $casts = [
        'deletavel' => 'boolean',
    ];

    /**
     * @return HasMany
     */
    public function atividades()
    {
        return $this->hasMany(Atividade::class);
    }
}
