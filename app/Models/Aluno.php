<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Aluno extends Model
{
    use HasFactory;
    protected $fillable = [
        'user_id',
        'turma',
        'nome',
        'nascimento',
        'sexo',
        'periodo',
    ];

    public function aluno()
    {
        return $this->belongsTo('App\Models\Matricula');
    }

    public function matricula()
    {
        return $this->hasMany('App\Models\Responsaveis');
    }
}