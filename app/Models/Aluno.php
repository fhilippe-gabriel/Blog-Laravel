<?php

namespace App\Models;

use App\Models\Contatos;
use App\Models\Responsaveis;
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

    // public function aluno()
    // {
    //     return $this->belongsTo(Matricula::class, 'foreign_key', 'local_key');
    // }

    public function responsaveis()
    {
        return $this->hasMany(Responsaveis::class);
    }

    public function contatos()
    {
        return $this->hasMany(Contatos::class);
    }

    public function saudes()
    {
        return $this->hasOne(Saude::class);
    }
}