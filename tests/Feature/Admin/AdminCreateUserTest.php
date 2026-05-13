<?php

namespace Tests\Feature\Admin;

use App\Models\User;
use Database\Seeders\RoleSeeder;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Spatie\Permission\Models\Role;
use Tests\TestCase;

class AdminCreateUserTest extends TestCase
{
    use RefreshDatabase;

    protected function setUp(): void
    {
        parent::setUp();
        $this->seed(RoleSeeder::class);
    }

    public function test_admin_can_create_user(): void
    {
        $admin = User::factory()->create(['approved_at' => now()]);
        $admin->assignRole('admin');

        $response = $this->actingAs($admin)->post(route('admin.users.store', absolute: false), [
            'name' => 'Creato Da Admin',
            'email' => 'creato@example.com',
            'password' => 'password-password',
            'password_confirmation' => 'password-password',
            'role' => 'user',
        ]);

        $response->assertRedirect(route('admin.users.index', absolute: false));
        $response->assertSessionHas('success');

        $user = User::query()->where('email', 'creato@example.com')->first();
        $this->assertNotNull($user);
        $this->assertTrue($user->isApproved());
        $this->assertNotNull($user->email_verified_at);
        $this->assertTrue($user->hasRole('user'));
    }

    public function test_non_admin_cannot_create_user(): void
    {
        $user = User::factory()->create(['approved_at' => now()]);
        $user->assignRole('user');

        $response = $this->actingAs($user)->post(route('admin.users.store', absolute: false), [
            'name' => 'Hacker',
            'email' => 'hacker@example.com',
            'password' => 'password-password',
            'password_confirmation' => 'password-password',
            'role' => Role::findByName('admin')->name,
        ]);

        $response->assertForbidden();
        $this->assertDatabaseMissing('users', ['email' => 'hacker@example.com']);
    }
}
