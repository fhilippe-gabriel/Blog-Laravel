<?php

namespace App\Rules;

use Illuminate\Contracts\Validation\Rule;

class CadastroPessoaJuridica implements Rule
{
    /**
     * Determine if the validation rule passes.
     *
     * @param string $attribute
     * @param mixed $value
     * @return bool
     */
    public function passes($attribute, $value)
    {
        $cnpj = preg_replace('/[^0-9]/', '', (string)$value);

        if (strlen($cnpj) != 14) return false;

        for ($i = 0, $j = 5, $sum = 0; $i < 12; $i++) {
            $sum += $cnpj{$i} * $j;
            $j = ($j == 2) ? 9 : $j - 1;
        }

        $rest = $sum % 11;

        if ($cnpj{12} != ($rest < 2 ? 0 : 11 - $rest)) return false;

        for ($i = 0, $j = 6, $sum = 0; $i < 13; $i++) {
            $sum += $cnpj{$i} * $j;
            $j = ($j == 2) ? 9 : $j - 1;
        }

        $rest = $sum % 11;

        return $cnpj{13} == ($rest < 2 ? 0 : 11 - $rest);
    }


    /**
     * Get the validation error message.
     *
     * @return string
     */
    public function message()
    {
        return 'O campo :attribute não contém um CNPJ válido.';
    }
}
