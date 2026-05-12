<?php

namespace App\Http\Controllers;

use App\Http\Requests\LinguaRequest;
use App\Models\Lingua;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class LinguaController extends Controller
{
    public function index(Request $request): Response
    {
        $lingue = $request->user()
            ->lingue()
            ->withCount('vocaboli')
            ->orderBy('name')
            ->get(['id', 'name'])
            ->map(fn ($l) => [
                'id' => $l->id,
                'name' => $l->name,
                'vocaboli_count' => $l->vocaboli_count,
            ]);

        return Inertia::render('Lingue/Index', [
            'lingue' => $lingue,
        ]);
    }

    public function store(LinguaRequest $request): RedirectResponse
    {
        $request->user()->lingue()->create($request->validated());

        return redirect()
            ->route('lingue.index')
            ->with('success', 'Lingua aggiunta.');
    }

    public function update(LinguaRequest $request, Lingua $lingua): RedirectResponse
    {
        $this->authorizeOwnership($request, $lingua);

        $lingua->update($request->validated());

        return redirect()
            ->route('lingue.index')
            ->with('success', 'Lingua aggiornata.');
    }

    public function destroy(Request $request, Lingua $lingua): RedirectResponse
    {
        $this->authorizeOwnership($request, $lingua);

        $lingua->delete();

        return redirect()
            ->route('lingue.index')
            ->with('success', 'Lingua eliminata.');
    }

    private function authorizeOwnership(Request $request, Lingua $lingua): void
    {
        abort_if($lingua->user_id !== $request->user()->id, 403);
    }
}
