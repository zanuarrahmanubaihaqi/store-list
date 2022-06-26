<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Http\Request;

class UserRequest extends FormRequest
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
        $rules = [
            'name'=>'required',
            'username'=>'required',
            'level'=>'required',
            'password'=>'required',
        ];

        return $rules;
    }

    function messages()
    {
        $text =  " required";
        $message = [
            'full_name.required'=>'FULL NAME' . $text,
            'username.required'=>'USERNAME' . $text,
            'level.required'=>'LEVEL' . $text,
            'password.required'=>'PASSWORD' . $text,
        ];

        return $message;
    }
}
