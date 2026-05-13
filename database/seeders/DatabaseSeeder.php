<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class DatabaseSeeder extends Seeder
{
    use WithoutModelEvents;

    public function run(): void
    {
        $this->call(RoleSeeder::class);

        $admin = User::firstOrCreate(
            ['email' => 'admin@example.com'],
            [
                'name' => 'Admin',
                'password' => Hash::make('password'),
                'email_verified_at' => now(),
                'approved_at' => now(),
            ],
        );
        $admin->syncRoles(['admin']);

        $user = User::firstOrCreate(
            ['email' => 'user@example.com'],
            [
                'name' => 'Utente',
                'password' => Hash::make('password'),
                'email_verified_at' => now(),
                'approved_at' => now(),
            ],
        );
        $user->syncRoles(['user']);
    }
}





