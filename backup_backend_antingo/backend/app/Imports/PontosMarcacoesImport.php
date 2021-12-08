<?php

namespace App\Imports;

use App\Models\Funcionario;
use App\Models\PontoMarcacao;
use Maatwebsite\Excel\Row;
use Maatwebsite\Excel\Concerns\OnEachRow;
use Maatwebsite\Excel\Concerns\WithCustomCsvSettings;
use Carbon\Carbon;
use DateTime;
use Exception;

class PontosMarcacoesImport implements OnEachRow, WithCustomCsvSettings
{
    private $hora_entrada = NULL;
    private $hora_saida = NULL;
    private $data_ponto = NULL;
    private $data_ponto_anterior = NULL;
    private $matricula = NULL;
    private $matricula_anterior = NULL;
    private $houveInsercao = false;
    public $log = array();

    public function onRow(Row $row)
    {
        $rowIndex = $row->getIndex();
        $row      = $row->toArray();
     
        //validando o layout do csv
        if($rowIndex == 1 && ($row[0] != 'Empresa Contr' || $row[8] != 'Matricula' || $row[16] != 'Data' || $row[17] != 'Hora')){
            throw new Exception("Layout do arquivo inválido.", 401);
        }
        $this->data_ponto = $row[16];
        $this->matricula = (int)$row[8];

        $quantidade_horas = $funcionario = NULL;
        //pula a primeira linha que contém o cabeçalho
        if (!isset($row[0]) || $row[0] == 'Empresa Contr') {
            return null;
        }

        //se a situação não for liberado, ignora
        if (!isset($row[11]) || $row[11] != 'Liberado') {
            $this->log[] = "O funcionário: " . $this->matricula . ", no dia: " . $this->data_ponto . " teve seu acesso bloqueado no horário: " . $row[17];
            return null;
        }

        if(is_null($this->data_ponto_anterior) || is_null($this->data_ponto)){
            $this->data_ponto = $this->data_ponto_anterior = $row[16];
        }
        if(is_null($this->matricula_anterior) || is_null($this->matricula)){
            $this->matricula = $this->matricula_anterior = $row[16];
        }


        if($this->data_ponto != $this->data_ponto_anterior){
            if(!is_null($this->hora_saida)){
                $this->log[] = "Hora de saída sem entrada: " . $this->hora_saida . " no dia: " . $this->data_ponto_anterior . " do funcionário com a matrícula: " . $this->matricula_anterior;
                $this->hora_saida = NULL;
            }
            if(!is_null($this->hora_entrada)){
                $this->log[] = "Hora de entrada sem saída: " . $this->hora_entrada . " no dia: " . $this->data_ponto_anterior . " do funcionário com a matrícula: " . $this->matricula_anterior;
                $this->hora_entrada = NULL;
            }
        }


        if($row[13] == 'saída'){
            if(!is_null($this->hora_saida) && is_null($this->hora_entrada)){
                $this->log[] = "Hora de saída sem entrada: " . $this->hora_saida . " no dia: " . $this->data_ponto_anterior . " do funcionário com a matrícula: " . $this->matricula_anterior;
                $this->hora_entrada = NULL;
            }
            $this->hora_saida = $row[17];
        }
        if($row[13] == 'Entrada'){
            if(is_null($this->hora_saida) && !is_null($this->hora_entrada)){
                $this->log[] = "Hora de entrada sem saída: " . $this->hora_entrada . " no dia: " . $this->data_ponto_anterior . " do funcionário com a matrícula: " . $this->matricula_anterior;
                $this->hora_entrada = NULL;
            }
            $this->hora_entrada = $row[17];
        }
        if(isset($this->hora_entrada) && isset($this->hora_saida) && !is_null($this->hora_entrada) && !is_null($this->hora_saida) ){

            $funcionario = Funcionario::select('id', 'matricula')->where('matricula', $this->matricula)->first();
            //se não encontrar o funcionário preenche o log e passa pro próximo registro do arquivo
            if(is_null($funcionario)){
                $this->log[] = "Funcionário com a matrícula: " . $this->matricula . " não foi encontrado.";
                return null;
            }
            
            $start = new DateTime($this->hora_entrada);
            $end = new DateTime($this->hora_saida);

            if ( $end <= $start ) {
                $this->log[] = "Hora de saída sem entrada: " . $this->hora_saida . " no dia: " . $this->data_ponto . " do funcionário com a matrícula: " . $this->matricula_anterior;
                $this->hora_saida = NULL;
            }else{
                $hora1 = Carbon::createFromFormat('d/m/Y H:i', $this->data_ponto . ' ' . $this->hora_entrada);
                $hora2 = Carbon::createFromFormat('d/m/Y H:i', $this->data_ponto . ' ' . $this->hora_saida);

                $quantidade_horas = number_format(($hora2->diffInMinutes($hora1)/60), 2);
            }
        }
        if($quantidade_horas < 0){
            $this->log[] = "Quantidade de horas inválida: " . $quantidade_horas . " no dia: " . $this->data_ponto;
            $this->hora_saida = '';
        }else if(!is_null($quantidade_horas)){
            
            $data = Carbon::createFromFormat('d/m/Y', $this->data_ponto);

            $pontoMarcacao = PontoMarcacao::updateOrCreate(
                [
                    'hora_entrada' => $this->hora_entrada,
                    'hora_saida' => $this->hora_saida,
                    'quantidade_horas' => $quantidade_horas,
                    'funcionario_id' => $funcionario['id'],
                    'data_ponto' => $data->format('Y-m-d'),
                ],
                [
                    'hora_entrada' => $this->hora_entrada,
                    'hora_saida' => $this->hora_saida,
                    'quantidade_horas' => $quantidade_horas,
                    'funcionario_id' => $funcionario['id'],
                    'data_ponto' => $data->format('Y-m-d'),
                ]
            );
            
            if(!is_null($pontoMarcacao)){
                $this->houveInsercao = true;
            }

            $this->hora_saida = $this->hora_entrada = NULL;
        }
        $this->data_ponto_anterior = $row[16];
        $this->matricula_anterior = (int)$row[8];
    }
    
    public function getCsvSettings(): array
    {
        return [
            'input_encoding' => 'ISO-8859-1',
            'delimiter' => ';'
        ];
    }

    public function getLog()
    {
        return $this->log;
    }

    public function getHouveInsercao()
    {
        return $this->houveInsercao;
    }
}
