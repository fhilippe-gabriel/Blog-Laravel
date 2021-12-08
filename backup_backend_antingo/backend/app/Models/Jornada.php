<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

/**
 * @OA\Schema(@OA\Xml(name="Jornada"))
 */

class Jornada extends Model
{
    /**
     * The table associated with the model.
     *
     * @var string
     */
    protected $table = 'jornadas';

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
    private $hora_inicio;

    /**
     * @OA\Property(format="256")
     * @var string
     */
    private $hora_fim;

    /**
     * @OA\Property(format="256")
     * @var string
     */
    private $percentual;

    /**
     * @OA\Property(format="256")
     * @var string
     */
    private $insalubridade;

    /**
     * @OA\Property(format="256")
     * @var string
     */
    private $periculosidade;

    protected $fillable = [
        'hora_inicio',
        'hora_fim',
        'percentual',
        'insalubridade',
        'periculosidade',
    ];
}
