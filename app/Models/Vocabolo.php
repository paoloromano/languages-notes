<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Vocabolo extends Model
{
    protected $table = 'vocaboli';

    protected $fillable = [
        'lingua_id',
        'term',
        'translation',
        'note',
    ];

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public function lingua(): BelongsTo
    {
        return $this->belongsTo(Lingua::class);
    }
}
