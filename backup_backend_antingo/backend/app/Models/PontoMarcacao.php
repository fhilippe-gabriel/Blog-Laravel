<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Carbon\Carbon;

/**
 * @OA\Schema(@OA\Xml(name="PontoMarcacao"))
 */
class PontoMarcacao extends Model
{
    /**
     * The table associated with the model.
     *
     * @var string
     */
    protected $table = 'pontos_marcacoes';

    /**
     * @OA\Property(format="int64")
     * @var int
     */
    private $id;

    /**
     * @OA\Property(format="int64")
     * @var string
     */
    private $hora_entrada;

    /**
     * @OA\Property(format="int64")
     * @var string
     */
    private $hora_saida;

    /**
     * @OA\Property(format="int64")
     * @var int
     */
    private $quantidade_horas;

    /**
     * @OA\Property(format="int64")
     * @var int
     */
    private $funcionario_id;

    /**
     * @OA\Property(format="int64")
     * @var date
     */
    private $data_ponto;

    protected $dateFormat = "Y-m-d H:i:s";

    protected $fillable = [
        'hora_entrada',
        'hora_saida',
        'quantidade_horas',
        'funcionario_id',
        'data_ponto',
    ];

    public function setHoraEntradaAttribute($value)
    {
        $this->attributes['hora_entrada'] = Carbon::createFromFormat('H:i', $value)->format('H:i:s');
    }

    public function setHoraSaidaAttribute($value)
    {
        $this->attributes['hora_saida'] = Carbon::createFromFormat('H:i', $value)->format('H:i:s');
    }

    public function getHoraEntradaAttribute($value)
    {
        return Carbon::createFromFormat('H:i:s', $value)->format('H:i');
    }

    public function getHoraSaidaAttribute($value)
    {
        return Carbon::createFromFormat('H:i:s', $value)->format('H:i');
    }

    /**
     * @return belongsTo
     */
    public function funcionarios() {
        return $this->belongsTo(Funcionario::class);
    }
}
