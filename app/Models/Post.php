<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Notifications\Notifiable;
use Laravel\Sanctum\HasApiTokens;
use Spatie\Permission\Traits\HasRoles;

class Post extends Model
{
    // protected $table = 'users';
    use HasFactory, Notifiable, HasApiTokens, HasRoles;
    protected $fillable = [
        'user_id', 'titulo', 'conteudo',
    ];

    // public function permission()
    // {
    //     return $this->BelongsToMany(Permission::class,
    //         'permission_id',
    //         'id'
    //     );
    // }

    // public function role()
    // {
    //     return $this->belongsToMany('Spatie\Permission\Models\Roles',
    //         'role_id',
    //         'name',
    //     );
    // }
}