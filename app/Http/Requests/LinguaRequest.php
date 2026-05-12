<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class LinguaRequest extends FormRequest
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
        $linguaId = $this->route('lingua')?->id;

        return [
            'name' => [
                'required',
                'string',
                'max:60',
                Rule::unique('lingue', 'name')
                    ->where(fn ($q) => $q->where('user_id', $this->user()->id))
                    ->ignore($linguaId),
            ],
        ];
    }

    /**
     * @return array<string, string>
     */
    public function attributes(): array
    {
        return [
            'name' => 'nome',
        ];
    }

    /**
     * @return array<string, string>
     */
    public function messages(): array
    {
        return [
            'name.unique' => 'Hai già una lingua con questo nome.',
        ];
    }
}
