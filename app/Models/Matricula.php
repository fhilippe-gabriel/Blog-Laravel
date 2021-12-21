<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Matricula extends Model
{

    use HasFactory;
    protected $fillable = [
        'user_id',
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

    // public function user()
    // {
    //     return $this->belongsTo(User::class);
    // }
    public function aluno()
    {
        return $this->hasOne(Aluno::class);
    }
}