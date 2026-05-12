<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class VocaboloRequest extends FormRequest
{
    public function authorize(): bool
    {
        return $this->user() !== null;
    }

    /**
     * @return array<string, mixed>
     */
    public function rules(): array
    {
        return [
            'lingua_id' => [
                'required',
                'integer',
                Rule::exists('lingue', 'id')
                    ->where(fn ($q) => $q->where('user_id', $this->user()->id)),
            ],
            'term' => ['required', 'string', 'max:255'],
            'translation' => ['required', 'string', 'max:255'],
            'note' => ['nullable', 'string', 'max:5000'],
        ];
    }

    /**
     * @return array<string, string>
     */
    public function attributes(): array
    {
        return [
            'lingua_id' => 'lingua',
            'term' => 'termine',
            'translation' => 'traduzione',
            'note' => 'note',
        ];
    }
}
