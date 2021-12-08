<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Support\Facades\Storage;

/**
 * @OA\Schema(@OA\Xml(name="Cliente"))
 */

class Cliente extends Model
{
    /**
     * The table associated with the model.
     *
     * @var string
     */
    protected $table = 'clientes';

    /**
     * The attributes that are mass assignable.
     *
     * @var array
     */

    /**
     * @OA\Property(format="int64")
     * @var int
     */
    private $id;

    /**
     * @OA\Property(format="256")
     * @var string
     */
    private $razao_social;

    /**
     * @OA\Property(format="256")
     * @var string
     */
    private $nome_fantasia;

    /**
     * @OA\Property(format="256")
     * @var string
     */
    private $cnpj;

    /**
     * @OA\Property(format="256")
     * @var string
     */
    private $contato_nome;

    /**
     * @OA\Property(format="256")
     * @var string
     */
    private $contato_cargo;

    /**
     * @OA\Property(format="256")
     * @var string
     */
    private $contato_fone;

    /**
     * @OA\Property(format="256")
     * @var int
     */
    private $codigo_cliente;

    /**
     * @OA\Property(format="256")
     * @var string
     */
    private $logo;

    protected $fillable = [
        'razao_social',
        'nome_fantasia',
        'cnpj',
        'contato_nome',
        'contato_cargo',
        'contato_fone',
        'logo',
        'codigo_cliente'
    ];

    /**
     * The attributes that should be hidden for arrays.
     *
     * @var array
     */
    protected $hidden = [];

    /**
     * @return HasMany
     */
    public function projetos()
    {
        return $this->hasMany(Projeto::class);
    }

    public function getLogoAttribute($value)
    {
        if ($value){
            $url = Storage::disk('minio')->url($value);
        } else {
            $url = '';
        }
        return $url;
    }
}
