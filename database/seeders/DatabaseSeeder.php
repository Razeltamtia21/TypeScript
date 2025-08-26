<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        // User::factory(10)->create();

        User::factory()->create([
            'name' => 'Test User',
            'email' => 'test@example.com',
            'password' => Hash::make('password'),
            'company_name' => 'Test Company',
            'company_address' => 'Jl. Test No. 123, Jakarta',
            'company_type' => 'bank',
            'profile_photo' => null,
            'company_logo' => null,
        ]);
    }
}