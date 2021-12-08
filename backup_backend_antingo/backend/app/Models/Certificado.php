<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\belongsToMany;

/**
 * @OA\Schema(@OA\Xml(name="Certificado"))
 */
class Certificado extends Model
{
    const SITUACOES = ['valido' => 'Válido', 'invalido' => 'Inválido', 'ativo' => 'Ativo', 'inativo' => 'Inativo'];
    
    protected $table = 'certificados';

    /**
     * @OA\Property(format="int64")
     * @var int
     */
    private $id;
    
    /**
     * @OA\Property(format="256")
     * @var string
     */
    private $nome_certificado;
    
    /**
     * @OA\Property(format="text")
     * @var string
     */
    private $validade_meses;

    /**
     * @OA\Property(format="256")
     * @var string
     */
    private $situacao;


    protected $fillable = [
        'nome_certificado',
        'validade_meses',
        'situacao',
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
        return $this->belongsToMany(Funcionario::class, 'funcionarios_certificados', 'certificado_id', 'funcionario_id')->withPivot('data_realizacao');
    }
 
}
