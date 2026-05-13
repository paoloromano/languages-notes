<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        $existingIndexes = Schema::getIndexListing('vocaboli');

        // Garantisco un indice singolo su user_id così la FK non blocca
        // il drop degli indici composti (user_id, english/italian).
        if (! in_array('vocaboli_user_id_index', $existingIndexes, true)) {
            Schema::table('vocaboli', function (Blueprint $table) {
                $table->index('user_id', 'vocaboli_user_id_index');
            });
        }

        Schema::table('vocaboli', function (Blueprint $table) use ($existingIndexes) {
            foreach (['vocaboli_user_id_english_index', 'vocaboli_user_id_italian_index'] as $idx) {
                if (in_array($idx, $existingIndexes, true)) {
                    $table->dropIndex($idx);
                }
            }
            $table->renameColumn('english', 'term');
            $table->renameColumn('italian', 'translation');
        });

        Schema::table('vocaboli', function (Blueprint $table) {
            $table->foreignId('lingua_id')
                ->nullable()
                ->after('user_id')
                ->constrained('lingue')
                ->cascadeOnDelete();

            $table->index(['lingua_id', 'term']);
            $table->index(['lingua_id', 'translation']);
        });

        // Assegna una lingua di default ("Inglese") agli eventuali vocaboli
        // già presenti, una per ciascun utente coinvolto.
        $userIds = DB::table('vocaboli')
            ->whereNull('lingua_id')
            ->distinct()
            ->pluck('user_id');

        foreach ($userIds as $userId) {
            $linguaId = DB::table('lingue')->insertGetId([
                'user_id' => $userId,
                'name' => 'Inglese',
                'created_at' => now(),
                'updated_at' => now(),
            ]);

            DB::table('vocaboli')
                ->where('user_id', $userId)
                ->whereNull('lingua_id')
                ->update(['lingua_id' => $linguaId]);
        }

        Schema::table('vocaboli', function (Blueprint $table) {
            $table->foreignId('lingua_id')->nullable(false)->change();
        });
    }

    public function down(): void
    {
        Schema::table('vocaboli', function (Blueprint $table) {
            $table->dropIndex(['lingua_id', 'term']);
            $table->dropIndex(['lingua_id', 'translation']);
            $table->dropConstrainedForeignId('lingua_id');
            $table->renameColumn('term', 'english');
            $table->renameColumn('translation', 'italian');
        });

        Schema::table('vocaboli', function (Blueprint $table) {
            $table->index(['user_id', 'english']);
            $table->index(['user_id', 'italian']);
        });
    }
};
