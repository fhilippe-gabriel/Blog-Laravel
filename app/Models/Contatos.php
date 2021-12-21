<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Contatos extends Model
{
    use HasFactory;
    protected $fillable = [
        'user_id',
        'nomeAutorizado',
        'filiacao',
        'telefone',
    ];
    // public function contatos()
    // {
    //     return $this->belongsTo(Aluno::class);
    // }
}