<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\User;
use Inertia\Inertia;
use Inertia\Response;

class DashboardController extends Controller
{
    public function index(): Response
    {
        return Inertia::render('Admin/Dashboard', [
            'stats' => [
                'users_total' => User::count(),
                'users_admin' => User::role('admin')->count(),
                'users_user' => User::role('user')->count(),
            ],
        ]);
    }
}
