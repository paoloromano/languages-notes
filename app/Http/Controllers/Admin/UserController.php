<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\Admin\StoreUserRequest;
use App\Models\User;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Inertia\Inertia;
use Inertia\Response;
use Spatie\Permission\Models\Role;

class UserController extends Controller
{
    public function index(Request $request): Response
    {
        $filter = $request->query('stato', 'all');
        if (! in_array($filter, ['all', 'pending', 'approved'], true)) {
            $filter = 'all';
        }

        $query = User::query()->orderByDesc('created_at');

        if ($filter === 'pending') {
            $query->whereNull('approved_at');
        } elseif ($filter === 'approved') {
            $query->whereNotNull('approved_at');
        }

        $users = $query->paginate(20)->withQueryString()->through(
            fn (User $user) => [
                'id' => $user->id,
                'name' => $user->name,
                'email' => $user->email,
                'roles' => $user->getRoleNames()->values()->all(),
                'approved_at' => $user->approved_at?->toIso8601String(),
                'created_at' => $user->created_at->toIso8601String(),
            ],
        );

        return Inertia::render('Admin/Users/Index', [
            'users' => $users,
            'filter' => $filter,
        ]);
    }

    public function create(): Response
    {
        return Inertia::render('Admin/Users/Create', [
            'roles' => Role::query()->orderBy('name')->pluck('name')->values()->all(),
        ]);
    }

    public function store(StoreUserRequest $request): RedirectResponse
    {
        $validated = $request->validated();

        $user = User::create([
            'name' => $validated['name'],
            'email' => $validated['email'],
            'password' => Hash::make($validated['password']),
        ]);

        $user->forceFill([
            'email_verified_at' => now(),
            'approved_at' => now(),
        ])->save();

        $user->syncRoles([$validated['role']]);

        return redirect()
            ->route('admin.users.index')
            ->with('success', __('admin.user_created'));
    }

    public function approve(User $user): RedirectResponse
    {
        if ($user->isApproved()) {
            return back()->with('success', __('admin.user_already_approved'));
        }

        $user->forceFill(['approved_at' => now()])->save();

        return back()->with('success', __('admin.user_approved'));
    }
}
