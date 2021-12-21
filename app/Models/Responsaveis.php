<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Responsaveis extends Model
{
    use HasFactory;
    protected $fillable = [
        'user_id',
        'nomeResponsavel',
        'nascimentoResponsavel',
        'RGresponsavel;',
        'CPFresponsavel',
        'enderecoResponsavel',
        'CEPresponsavel',
        'celularResponsavel',
        'telefonecasaResponavel',
        'telefonecomercialResponavel',
        'emailResponsavel',
    ];

    // public function responsaveis()
    // {
    //     return $this->belongsTo(Matricula::class);
    // }
}