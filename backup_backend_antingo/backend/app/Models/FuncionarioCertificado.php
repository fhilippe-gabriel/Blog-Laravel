<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

/**
 * @OA\Schema(@OA\Xml(name="FuncionarioCertificado"))
 */
class FuncionarioCertificado extends Model
{
    protected $table = 'funcionarios_certificados';

    /**
     * @OA\Property(format="int64")
     * @var int
     */
    private $id;

     /**
     * @OA\Property(format="256")
     * @var string
     */
    private $data_realizacao;

    protected $fillable = [
        'funcionario_id',
        'certificado_id',
        'data_realizacao',
    ];

	protected $dates = [
		'created_at', 'updated_at',
	];

    /**
     * @return manyToMany
     */
    public function funcionarios() {
        return $this->belongsToMany(Funcionario::class);
    }

    /**
     * @return manyToMany
     */
    public function certificados() {
        return $this->belongsToMany(Certificado::class);
    }
}
