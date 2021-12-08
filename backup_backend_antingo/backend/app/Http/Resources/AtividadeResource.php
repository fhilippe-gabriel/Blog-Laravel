<?php

namespace App\Http\Resources;

use Illuminate\Http\Resources\Json\JsonResource;

class AtividadeResource extends JsonResource
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
            'numero' => $this->numero,
            'descricao' => $this->descricao,
            'data_inicio' => $this->data_inicio,
            'data_termino' => $this->data_termino,
            'quantidade_dias' => $this->quantidade_dias,
            'horas_previstas' => $this->horas_previstas,
            'horas_realizadas' => $this->horas_realizadas,
            'responsavel' => $this->responsavel,
            'projeto' => $this->projeto,
            'tarifa' => $this->tarifa,
            'tipo_atividade' => $this->tipo_atividade,
            'tipo_faturamento' => $this->tipo_faturamento,
            'observacao' => $this->observacao,
        ];
    }
}
