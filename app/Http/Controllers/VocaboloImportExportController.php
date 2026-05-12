<?php

namespace App\Http\Controllers;

use App\Http\Requests\VocaboloImportRequest;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;
use Symfony\Component\HttpFoundation\StreamedResponse;

class VocaboloImportExportController extends Controller
{
    private const MAX_IMPORT_ROWS = 5000;

    public function export(Request $request): StreamedResponse
    {
        $user = $request->user();

        $linguaId = (int) $request->query('lingua_id') ?: null;
        $letter = strtoupper(trim((string) $request->query('letter', '')));
        $letter = preg_match('/^[A-Z]$/', $letter) ? $letter : '';
        $q = trim((string) $request->query('q', ''));

        if ($linguaId && ! $user->lingue()->whereKey($linguaId)->exists()) {
            $linguaId = null;
        }

        $vocaboliQuery = $user->vocaboli()
            ->with('lingua:id,name')
            ->when($linguaId, fn ($qq) => $qq->where('lingua_id', $linguaId))
            ->when($letter !== '', fn ($qq) => $qq->whereRaw('UPPER(LEFT(term, 1)) = ?', [$letter]))
            ->when($q !== '', function ($qq) use ($q) {
                $qq->where(function ($w) use ($q) {
                    $w->where('term', 'like', "%{$q}%")
                        ->orWhere('translation', 'like', "%{$q}%")
                        ->orWhere('note', 'like', "%{$q}%");
                });
            })
            ->orderBy('lingua_id')
            ->orderBy('term');

        $filename = $this->buildFilename($user, $linguaId);

        return response()->streamDownload(function () use ($vocaboliQuery) {
            $out = fopen('php://output', 'w');

            // UTF-8 BOM così Excel su Windows legge correttamente gli accenti.
            fwrite($out, "\xEF\xBB\xBF");

            fputcsv($out, ['lingua', 'term', 'translation', 'note']);

            $vocaboliQuery->chunk(500, function ($chunk) use ($out) {
                foreach ($chunk as $v) {
                    fputcsv($out, [
                        $v->lingua?->name ?? '',
                        $v->term,
                        $v->translation,
                        $v->note ?? '',
                    ]);
                }
            });

            fclose($out);
        }, $filename, [
            'Content-Type' => 'text/csv; charset=UTF-8',
        ]);
    }

    public function importForm(Request $request): Response
    {
        $lingue = $request->user()->lingue()->orderBy('name')->get(['id', 'name']);

        return Inertia::render('Vocaboli/Import', [
            'lingue' => $lingue,
            'preselectLinguaId' => (int) $request->query('lingua_id') ?: null,
        ]);
    }

    public function import(VocaboloImportRequest $request): RedirectResponse
    {
        $user = $request->user();
        $linguaId = (int) $request->validated('lingua_id');
        $skipDuplicates = (bool) $request->boolean('skip_duplicates', true);

        $path = $request->file('file')->getRealPath();
        $handle = fopen($path, 'r');

        if ($handle === false) {
            return back()->with('error', 'Impossibile aprire il file.');
        }

        // Rimuove eventuale BOM UTF-8 dal primo carattere.
        $first = fgets($handle);
        if ($first !== false) {
            $first = preg_replace('/^\xEF\xBB\xBF/', '', $first) ?? $first;
            rewind($handle);
            $stripped = tmpfile();
            fwrite($stripped, $first);
            fwrite($stripped, stream_get_contents($handle));
            fclose($handle);
            rewind($stripped);
            $handle = $stripped;
        }

        $header = fgetcsv($handle);
        if (! is_array($header)) {
            fclose($handle);

            return back()->with('error', 'Il file CSV è vuoto o non valido.');
        }

        $header = array_map(
            fn ($h) => strtolower(trim((string) $h)),
            $header,
        );

        $idxTerm = array_search('term', $header, true);
        $idxTranslation = array_search('translation', $header, true);
        $idxNote = array_search('note', $header, true);

        if ($idxTerm === false || $idxTranslation === false) {
            fclose($handle);

            return back()->with('error', 'Intestazioni richieste: term, translation (note opzionale).');
        }

        $existingTerms = $skipDuplicates
            ? $user->vocaboli()
                ->where('lingua_id', $linguaId)
                ->pluck('term')
                ->map(fn ($t) => mb_strtolower($t))
                ->flip()
            : collect();

        $imported = 0;
        $skipped = 0;
        $errors = 0;
        $rowNumber = 1; // header già letto

        while (($row = fgetcsv($handle)) !== false) {
            $rowNumber++;

            if ($rowNumber - 1 > self::MAX_IMPORT_ROWS) {
                $errors++;
                break;
            }

            $term = isset($row[$idxTerm]) ? trim((string) $row[$idxTerm]) : '';
            $translation = isset($row[$idxTranslation]) ? trim((string) $row[$idxTranslation]) : '';
            $note = ($idxNote !== false && isset($row[$idxNote]))
                ? trim((string) $row[$idxNote])
                : null;

            if ($term === '' || $translation === '') {
                $errors++;

                continue;
            }

            if (mb_strlen($term) > 255 || mb_strlen($translation) > 255) {
                $errors++;

                continue;
            }

            if ($skipDuplicates && $existingTerms->has(mb_strtolower($term))) {
                $skipped++;

                continue;
            }

            $user->vocaboli()->create([
                'lingua_id' => $linguaId,
                'term' => $term,
                'translation' => $translation,
                'note' => $note !== '' ? $note : null,
            ]);

            if ($skipDuplicates) {
                $existingTerms->put(mb_strtolower($term), true);
            }

            $imported++;
        }

        fclose($handle);

        $summary = sprintf(
            'Import completato: %d importati, %d saltati, %d errori.',
            $imported,
            $skipped,
            $errors,
        );

        return redirect()
            ->route('vocaboli.index', ['lingua_id' => $linguaId])
            ->with('success', $summary);
    }

    private function buildFilename($user, ?int $linguaId): string
    {
        $base = 'vocaboli';
        if ($linguaId) {
            $lingua = $user->lingue()->find($linguaId);
            if ($lingua) {
                $base .= '-'.preg_replace('/[^a-z0-9]+/i', '-', strtolower($lingua->name));
            }
        }

        return $base.'-'.now()->format('Ymd-His').'.csv';
    }
}
