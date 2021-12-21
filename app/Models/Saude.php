<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Saude extends Model
{
    use HasFactory;
    protected $fillable = [
        'user_id',
        'hospital',
        'planoSaude',
        'problemaSaude',
        'alergia',
        'PNE',
        'periodo',
    ];
}