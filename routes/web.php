<?php

use App\Http\Controllers\Admin\DashboardController as AdminDashboardController;
use App\Http\Controllers\LinguaController;
use App\Http\Controllers\ProfileController;
use App\Http\Controllers\VocaboloController;
use App\Http\Controllers\VocaboloImportExportController;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::get('/', function () {
    return auth()->check()
        ? redirect()->route('dashboard')
        : redirect()->route('login');
})->name('home');

Route::get('/dashboard', function () {
    return Inertia::render('Dashboard');
})->middleware(['auth', 'verified'])->name('dashboard');

Route::middleware('auth')->group(function () {
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');
});

Route::middleware(['auth', 'verified'])->group(function () {
    Route::resource('lingue', LinguaController::class)
        ->parameters(['lingue' => 'lingua'])
        ->except(['show', 'create', 'edit']);

    Route::get('vocaboli/export', [VocaboloImportExportController::class, 'export'])
        ->name('vocaboli.export');
    Route::get('vocaboli/import', [VocaboloImportExportController::class, 'importForm'])
        ->name('vocaboli.import.form');
    Route::post('vocaboli/import', [VocaboloImportExportController::class, 'import'])
        ->name('vocaboli.import');

    Route::resource('vocaboli', VocaboloController::class)
        ->parameters(['vocaboli' => 'vocabolo'])
        ->except(['show']);
});

Route::middleware(['auth', 'verified', 'role:admin'])
    ->prefix('admin')
    ->name('admin.')
    ->group(function () {
        Route::get('/', [AdminDashboardController::class, 'index'])->name('dashboard');
    });

require __DIR__.'/auth.php';
