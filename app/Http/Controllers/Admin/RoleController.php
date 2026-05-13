<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;
use Inertia\Response;
use Spatie\Permission\Models\Role;

class RoleController extends Controller
{
    public function index(): Response
    {
        $modelHasRoles = config('permission.table_names.model_has_roles');
        $rolePivotKey = config('permission.column_names.role_pivot_key') ?: 'role_id';

        $userCounts = DB::table($modelHasRoles)
            ->select($rolePivotKey, DB::raw('count(*) as aggregate'))
            ->where('model_type', User::class)
            ->groupBy($rolePivotKey)
            ->pluck('aggregate', $rolePivotKey);

        $roles = Role::query()
            ->withCount('permissions')
            ->orderBy('name')
            ->get()
            ->map(fn (Role $role) => [
                'id' => $role->id,
                'name' => $role->name,
                'guard_name' => $role->guard_name,
                'permissions_count' => $role->permissions_count,
                'users_count' => (int) ($userCounts[$role->id] ?? 0),
            ]);

        return Inertia::render('Admin/Roles/Index', [
            'roles' => $roles,
        ]);
    }
}
