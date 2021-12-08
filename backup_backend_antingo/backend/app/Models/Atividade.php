<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

/**
 * @OA\Schema(@OA\Xml(name="Atividade"))
 */
class Atividade extends Model
{
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
    private $data_inicio;

    /**
     * @var string
     * @OA\Property(format="256")
     */
    private $data_termino;

    /**
     * @var integer
     * @OA\Property(format="int64")
     */
    private $quantidade_dias;

    /**
     * @var integer
     * @OA\Property(format="int64")
     */
    private $horas_previstas;

    /**
     * @var integer
     * @OA\Property(format="int64")
     */
    private $horas_realizadas;

    /**
     * @var integer
     * @OA\Property(format="int64")
     */
    private $responsavel_id;

    /**
     * @var integer
     * @OA\Property(format="int64")
     */
    private $projeto_id;

    /**
     * @var integer
     * @OA\Property(format="int64")
     */
    private $tarifa_id;

    /**
     * @var integer
     * @OA\Property(format="int64")
     */
    private $tipo_atividade_id;

    /**
     * @var integer
     * @OA\Property(format="int64")
     */
    private $tipo_faturamento_id;

    /**
     * @var string
     * @OA\Property(format="256")
     */
    private $observacao;

    protected $fillable = [
        'numero',
        'descricao',
        'data_inicio',
        'data_termino',
        'quantidade_dias',
        'horas_previstas',
        'horas_realizadas',
        'responsavel_id',
        'projeto_id',
        'tarifa_id',
        'tipo_atividade_id',
        'tipo_faturamento_id',
        'observacao',
    ];

	protected $dates = [
		'created_at', 'updated_at',
	];

    /**
     * @return belongsTo
     */
    public function responsavel() {
        return $this->belongsTo(Funcionario::class);
    }

    /**
     * @return belongsTo
     */
    public function projeto() {
        return $this->belongsTo(Projeto::class);
    }

    /**
     * @return belongsTo
     */
    public function tarifa() {
        return $this->belongsTo(Tarifa::class);
    }

    /**
     * @return belongsTo
     */
    public function tipo_atividade() {
        return $this->belongsTo(TipoAtividade::class);
    }

    /**
     * @return belongsTo
     */
    public function tipo_faturamento() {
        return $this->belongsTo(TipoFaturamento::class);
    }
}
