<?php

namespace App\Http\Resources;

use Illuminate\Http\Resources\Json\JsonResource;

class EquipamentoResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return array
     */
    public function toArray($request)
    {
        return [
            'id' => $this->id,
            'nome_recurso' => $this->nome_recurso,
            'tipo_recurso' => $this->tiposRecursos,
            'observacao' => $this->observacao,
        ];
    }
}
