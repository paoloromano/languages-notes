<?php

namespace Tests\Feature\Admin;

use App\Models\User;
use Database\Seeders\RoleSeeder;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class RoleIndexTest extends TestCase
{
    use RefreshDatabase;

    protected function setUp(): void
    {
        parent::setUp();
        $this->seed(RoleSeeder::class);
    }

    public function test_admin_can_view_roles_page(): void
    {
        $admin = User::factory()->create(['approved_at' => now()]);
        $admin->assignRole('admin');

        $response = $this->actingAs($admin)->get(route('admin.roles.index', absolute: false));

        $response->assertOk();
        $response->assertInertia(fn ($page) => $page
            ->component('Admin/Roles/Index')
            ->has('roles', 2));
    }

    public function test_non_admin_cannot_view_roles_page(): void
    {
        $user = User::factory()->create(['approved_at' => now()]);
        $user->assignRole('user');

        $response = $this->actingAs($user)->get(route('admin.roles.index', absolute: false));

        $response->assertForbidden();
    }
}
