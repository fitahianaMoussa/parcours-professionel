<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;
use App\Models\User;

class UserSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Create Admin User
        User::create([
            'name' => 'Admin User',
            'email' => 'admin@example.com',
            'password' => Hash::make('password'), // Use a strong password
            'role' => 'admin',
        ]);

        // Create RH User
        User::create([
            'name' => 'RH User',
            'email' => 'rh@example.com',
            'password' => Hash::make('password'), // Use a strong password
            'role' => 'RH',
        ]);
    }
}
