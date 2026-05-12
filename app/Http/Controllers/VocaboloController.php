<?php

namespace App\Http\Controllers;

use App\Http\Requests\VocaboloRequest;
use App\Models\Lingua;
use App\Models\Vocabolo;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class VocaboloController extends Controller
{
    public function index(Request $request): Response
    {
        $user = $request->user();

        $lingue = $user->lingue()
            ->withCount('vocaboli')
            ->orderBy('name')
            ->get(['id', 'name'])
            ->map(fn ($l) => [
                'id' => $l->id,
                'name' => $l->name,
                'vocaboli_count' => $l->vocaboli_count,
            ]);

        $linguaId = $this->resolveLinguaId($request, $lingue);
        $q = trim((string) $request->query('q', ''));
        $letter = $this->normalizeLetter((string) $request->query('letter', ''));

        $availableLetters = $linguaId
            ? $user->vocaboli()
                ->where('lingua_id', $linguaId)
                ->selectRaw('UPPER(LEFT(term, 1)) AS letter')
                ->distinct()
                ->orderBy('letter')
                ->pluck('letter')
                ->filter(fn ($l) => $l !== '' && preg_match('/^[A-Z]$/', $l))
                ->values()
                ->all()
            : [];

        $vocaboliQuery = $user->vocaboli()
            ->when($linguaId, fn ($qq) => $qq->where('lingua_id', $linguaId))
            ->when($letter !== '', fn ($qq) => $qq->whereRaw('UPPER(LEFT(term, 1)) = ?', [$letter]))
            ->when($q !== '', function ($qq) use ($q) {
                $qq->where(function ($w) use ($q) {
                    $w->where('term', 'like', "%{$q}%")
                        ->orWhere('translation', 'like', "%{$q}%")
                        ->orWhere('note', 'like', "%{$q}%");
                });
            })
            ->orderBy('term');

        $vocaboli = $linguaId
            ? $vocaboliQuery->paginate(25)->withQueryString()
            : new \Illuminate\Pagination\LengthAwarePaginator([], 0, 25);

        return Inertia::render('Vocaboli/Index', [
            'vocaboli' => $vocaboli,
            'lingue' => $lingue,
            'availableLetters' => $availableLetters,
            'filters' => [
                'q' => $q,
                'lingua_id' => $linguaId,
                'letter' => $letter,
            ],
        ]);
    }

    private function normalizeLetter(string $letter): string
    {
        $letter = strtoupper(trim($letter));

        return preg_match('/^[A-Z]$/', $letter) ? $letter : '';
    }

    public function create(Request $request): Response
    {
        $lingue = $request->user()->lingue()->orderBy('name')->get(['id', 'name']);

        return Inertia::render('Vocaboli/Create', [
            'lingue' => $lingue,
            'preselectLinguaId' => (int) $request->query('lingua_id') ?: null,
        ]);
    }

    public function store(VocaboloRequest $request): RedirectResponse
    {
        $request->user()->vocaboli()->create($request->validated());

        return redirect()
            ->route('vocaboli.index', ['lingua_id' => $request->integer('lingua_id')])
            ->with('success', 'Vocabolo aggiunto.');
    }

    public function edit(Request $request, Vocabolo $vocabolo): Response
    {
        $this->authorizeOwnership($request, $vocabolo);

        $lingue = $request->user()->lingue()->orderBy('name')->get(['id', 'name']);

        return Inertia::render('Vocaboli/Edit', [
            'vocabolo' => $vocabolo->only(['id', 'lingua_id', 'term', 'translation', 'note']),
            'lingue' => $lingue,
        ]);
    }

    public function update(VocaboloRequest $request, Vocabolo $vocabolo): RedirectResponse
    {
        $this->authorizeOwnership($request, $vocabolo);

        $vocabolo->update($request->validated());

        return redirect()
            ->route('vocaboli.index', ['lingua_id' => $vocabolo->lingua_id])
            ->with('success', 'Vocabolo aggiornato.');
    }

    public function destroy(Request $request, Vocabolo $vocabolo): RedirectResponse
    {
        $this->authorizeOwnership($request, $vocabolo);

        $linguaId = $vocabolo->lingua_id;
        $vocabolo->delete();

        return redirect()
            ->route('vocaboli.index', ['lingua_id' => $linguaId])
            ->with('success', 'Vocabolo eliminato.');
    }

    /**
     * Risolve la lingua corrente: parametro esplicito (se appartiene
     * all'utente) oppure la prima lingua disponibile.
     *
     * @param  \Illuminate\Support\Collection<int, array{id:int,name:string,vocaboli_count:int}>  $lingue
     */
    private function resolveLinguaId(Request $request, $lingue): ?int
    {
        $requested = (int) $request->query('lingua_id');

        if ($requested && $lingue->contains(fn ($l) => $l['id'] === $requested)) {
            return $requested;
        }

        return $lingue->first()['id'] ?? null;
    }

    private function authorizeOwnership(Request $request, Vocabolo $vocabolo): void
    {
        abort_if($vocabolo->user_id !== $request->user()->id, 403);
    }
}
