<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class StoreUpdatePost extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     *
     * @return bool
     */
    public function authorize()
    {
        return true;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array
     */
    public function rules()
    {
        $id = $this->segment(2);
        return [
            // 'title' => 'min:5|max:160|unique:posts|unique:title',
            'title' => [
                'required',
                'min:5',
                'max:160',
                // "unique:posts,title,{$id},id",
                Rule::unique('posts')->ignore($id),
            ],
            'content' => ['nullable', 'min:5', 'max:100'],
            'image' => ['required', 'image'],
        ];
    }
}