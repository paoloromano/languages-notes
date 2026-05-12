<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class VocaboloImportRequest extends FormRequest
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
            'file' => [
                'required',
                'file',
                'max:2048', // 2 MB
                'mimes:csv,txt',
            ],
            'skip_duplicates' => ['nullable', 'boolean'],
        ];
    }

    /**
     * @return array<string, string>
     */
    public function attributes(): array
    {
        return [
            'lingua_id' => 'lingua',
            'file' => 'file CSV',
            'skip_duplicates' => 'opzione duplicati',
        ];
    }

    /**
     * @return array<string, string>
     */
    public function messages(): array
    {
        return [
            'file.mimes' => 'Il file deve essere un CSV (.csv o .txt).',
            'file.max' => 'Il file non può superare 2 MB.',
        ];
    }
}
