<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('vocaboli', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')
                ->constrained()
                ->cascadeOnDelete();
            $table->string('english');
            $table->string('italian');
            $table->text('note')->nullable();
            $table->timestamps();

            $table->index(['user_id', 'english']);
            $table->index(['user_id', 'italian']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('vocaboli');
    }
};
