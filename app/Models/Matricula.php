<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Matricula extends Model
{

    use HasFactory;
    protected $fillable = [
        'user_id',
        'contatoAvosMaternos',
        'contatoAvosPaternos',
        'contatoPediatrA',
        'contatoOutros',
        'autorizado1',
        'parentescoAutorizado1',
        'rgAutorizado1',
        'autorizado2',
        'avisarEmergencia',
        'hospital',
        'planoSaude',
        'problemaSaude',
        'alergia',
        'PNE',
        'anexoCertidãoNasicmento',
        'anexoRgAluno',
        'anexoTransferenciaAluno',
        'anexoHistoricoEscolar',
        'anexoComprovantePagamento',
        'anexoRgResponsavelContrato',
        'anexoCpfResponsavelContrato',
        'anexoComprovanteresidencial',
        'anexoVacina',
        'perfilAluno',
    ];

    public function user()
    {
        return $this->belongsTo('App\Models\User');
    }
    public function aluno()
    {
        return $this->hasOne('App\Models\Aluno');
    }
}