<?php

namespace Tests\Feature\Admin;

use App\Models\User;
use Database\Seeders\RoleSeeder;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class UserApprovalTest extends TestCase
{
    use RefreshDatabase;

    protected function setUp(): void
    {
        parent::setUp();
        $this->seed(RoleSeeder::class);
    }

    public function test_admin_can_list_users(): void
    {
        $admin = User::factory()->create(['approved_at' => now()]);
        $admin->assignRole('admin');

        User::factory()->create(['approved_at' => null]);

        $response = $this->actingAs($admin)->get(route('admin.users.index', absolute: false));

        $response->assertStatus(200);
    }

    public function test_admin_can_approve_pending_user(): void
    {
        $admin = User::factory()->create(['approved_at' => now()]);
        $admin->assignRole('admin');

        $pending = User::factory()->pendingApproval()->create();
        $pending->assignRole('user');

        $response = $this->actingAs($admin)->post(
            route('admin.users.approve', ['user' => $pending->id], absolute: false),
        );

        $response->assertRedirect();
        $response->assertSessionHas('success');

        $this->assertNotNull($pending->fresh()->approved_at);
    }

    public function test_non_admin_cannot_approve_users(): void
    {
        $user = User::factory()->create(['approved_at' => now()]);
        $user->assignRole('user');

        $pending = User::factory()->pendingApproval()->create();
        $pending->assignRole('user');

        $response = $this->actingAs($user)->post(
            route('admin.users.approve', ['user' => $pending->id], absolute: false),
        );

        $response->assertForbidden();
    }
}
