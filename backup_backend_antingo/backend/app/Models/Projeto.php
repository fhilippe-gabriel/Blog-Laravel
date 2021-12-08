<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

/**
 * @OA\Schema(@OA\Xml(name="Projeto"))
 */
class Projeto extends Model
{
    /**
     * The table associated with the model.
     *
     * @var string
     */
    protected $table = 'projetos';

    /**
     * @OA\Property(format="int64")
     * @var int
     */
    private $id;

    /**
     * @OA\Property(format="256")
     * @var string
     */
    private $descricao;

    /**
     * @OA\Property(format="256")
     * @var string
     */
    private $valor;

    /**
     * @OA\Property(format="256")
     * @var string
     */
    private $data_inicio;

    /**
     * @OA\Property(format="256")
     * @var string
     */
    private $data_fim;

    /**
     * @OA\Property(format="256")
     * @var string
     */
    private $local;

    /**
     * @OA\Property(format="256")
     * @var int
     */
    private $cliente_id;

    /**
     * @OA\Property(format="256")
     * @var int
     */
    private $codigo_projeto;

    protected $fillable = [
        'descricao',
        'valor',
        'data_inicio',
        'data_fim',
        'local',
        'cliente_id',
        'codigo_projeto'
    ];

    /**
     * The attributes that should be hidden for arrays.
     *
     * @var array
     */
    protected $hidden = [
    ];

    /**
     * @return BelongsTo
     */
    public function cliente()
    {
        return $this->belongsTo(Cliente::class);
    }

    /**
     * @return HasMany
     */
    public function atividades()
    {
        return $this->hasMany(Atividade::class);
    }
}
