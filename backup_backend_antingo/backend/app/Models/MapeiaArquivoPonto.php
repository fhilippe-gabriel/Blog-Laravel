<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

/**
 * @OA\Schema(@OA\Xml(name="PontoMarcacao"))
 */
class MapeiaArquivoPonto extends Model
{
    
    /**
     * The table associated with the model.
     *
     * @var string
     */
    protected $table = 'mapeamento_arquivo_ponto';

    /**
     * @OA\Property(format="int64")
     * @var int
     */
    private $id;

    /**
     * @OA\Property(format="int64")
     * @var string
     */
    private $coluna_arquivo;

    /**
     * @OA\Property(format="int64")
     * @var string
     */
    private $coluna_banco_dados;

    /**
     * @OA\Property(format="int64")
     * @var int
     */
    private $cliente_id;

    protected $fillable = [
        'coluna_arquivo',
        'coluna_banco_dados',
        'cliente_id',
    ];

    /**
     * @return belongsTo
     */
    public function clientes() {
        return $this->belongsTo(Cliente::class);
    }
}
