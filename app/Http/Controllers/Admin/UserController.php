<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

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

    public function approve(User $user): RedirectResponse
    {
        if ($user->isApproved()) {
            return back()->with('success', __('admin.user_already_approved'));
        }

        $user->forceFill(['approved_at' => now()])->save();

        return back()->with('success', __('admin.user_approved'));
    }
}
