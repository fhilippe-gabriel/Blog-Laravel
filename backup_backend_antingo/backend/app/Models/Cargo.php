<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

/**
 * @OA\Schema(@OA\Xml(name="Cargo"))
 */
class Cargo extends Model
{
    protected $table = 'cargos';

    /**
     * @OA\Property(format="int64")
     * @var int
     */
    private $id;

    /**
     * @OA\Property(format="256")
     * @var string
     */
    private $cargo;
    
    /**
     * @OA\Property(format="256")
     * @var string
     */
    private $descricao;
    
    /**
     * @OA\Property(format="256")
     * @var string
     */
    private $detalhes;

    protected $fillable = [
        'cargo',
        'descricao',
        'detalhes',
    ];

    /**
     * The attributes that should be hidden for arrays.
     *
     * @var array
     */
    protected $hidden = [];

    public function funcionarios()
    {
        return $this->hasMany(Funcionario::class);
    }
}
