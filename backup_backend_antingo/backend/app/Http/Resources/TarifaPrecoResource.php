<?php

namespace App\Http\Resources;

use Illuminate\Http\Resources\Json\JsonResource;

class TarifaPrecoResource extends JsonResource
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
            'valor' => $this->valor,
            'tarifa' => $this->tarifas,
            'tipo_recurso' => $this->tiposRecursos,
            'observacao' => $this->observacao,
        ];
    }
}
