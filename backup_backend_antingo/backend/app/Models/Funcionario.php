<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\belongsToMany;

/**
 * @OA\Schema(@OA\Xml(name="Funcionario"))
 */
class Funcionario extends Model
{
    protected $table = 'funcionarios';

    /**
     * @OA\Property(format="int64")
     * @var int
     */
    private $id;

    /**
     * @OA\Property(format="256")
     * @var string
     */
    private $nome;

    /**
     * @OA\Property(format="256")
     * @var string
     */
    private $data_admissao;

    /**
     * @OA\Property(format="256")
     * @var string
     */
    private $data_demissao;

    /**
     * @OA\Property(format="256")
     * @var string
     */
    private $salario;

    /**
     * @OA\Property(format="256")
     * @var string
     */
    private $dia_pagamento;

    /**
     * @OA\Property(format="256")
     * @var string
     */
    private $rg;

    /**
     * @OA\Property(format="256")
     * @var string
     */
    private $cpf;

    /**
     * @OA\Property(format="256")
     * @var string
     */
    private $ctps;

    /**
     * @OA\Property(format="256")
     * @var string
     */
    private $telefone_fixo;

    /**
     * @OA\Property(format="256")
     * @var string
     */
    private $celular;

    /**
     * @OA\Property(format="256")
     * @var string
     */
    private $pis;

    /**
     * @OA\Property(format="256")
     * @var string
     */
    private $status;

    /**
     * @OA\Property(format="int64")
     * @var int
     */
    private $cargo_id;

    /**
     * @OA\Property(format="256")
     * @var string
     */
    private $matricula;

    /**
     * @OA\Property(format="256")
     * @var string
     */
    private $email;

    /**
     * @OA\Property(format="256")
     * @var string
     */
    private $apelido;

    protected $fillable = [
        'nome',
        'data_admissao',
        'data_demissao',
        'salario',
        'dia_pagamento',
        'rg',
        'cpf',
        'ctps',
        'telefone_fixo',
        'celular',
        'pis',
        'status',
        'cargo_id',
        'matricula',
        'email',
        'apelido',
    ];

    /**
     * The attributes that should be hidden for arrays.
     *
     * @var array
     */
    protected $hidden = [];

    public function getSalarioAttribute($value)
    {
        return number_format($value, 2, ",", ".");
    }

   /**
     * @return belongsToMany
     */
    public function cargos()
    {
        return $this->belongsToMany(Cargo::class);
    }

    /**
     * @return belongsToMany
     */
    public function certificados() {
        return $this->belongsToMany(Certificado::class,'funcionarios_certificados','funcionario_id','certificado_id')->withPivot('data_realizacao')->withTimestamps();
    }

    /**
     * @return belongsToMany
     */
    public function exames() {
        return $this->belongsToMany(Exame::class,'funcionarios_exames','funcionario_id','exame_id')->withPivot('data_realizacao')->withTimestamps();
    }

    /**
     * @return HasMany
     */
    public function atividades()
    {
        return $this->hasMany(Atividade::class);
    }

    /**
     * @return HasMany
     */
    public function pontosMarcacoes()
    {
        return $this->hasMany(PontoMarcacao::class);
    }
}
