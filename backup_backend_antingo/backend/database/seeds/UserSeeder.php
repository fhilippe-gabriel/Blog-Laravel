<?php

use App\Models\User;
use Illuminate\Database\Seeder;

class UserSeeder extends Seeder
{
    public function run()
    {
        factory(User::class, 10)->create();

        User::insert(
            [
                [
                    'name' => 'Hellison Oliveira',
                    'email' => 'hellison.oliveira@gmail.com',
                    'email_verified_at' => now(),
                    'password' => Hash::make('123456'),
                    'created_at' => now(),
                    'updated_at' => now(),
                    'remember_token' => Str::random(10),
                ],
                [
                    'name' => 'Fernando Pedro',
                    'email' => 'fernandopedro@gmail.com',
                    'email_verified_at' => now(),
                    'password' => Hash::make('123456'),
                    'created_at' => now(),
                    'updated_at' => now(),
                    'remember_token' => Str::random(10),
                ],
                [
                    'name' => 'Ricardo Barcellos',
                    'email' => 'rb@tecnoplace.com.br',
                    'email_verified_at' => now(),
                    'password' => Hash::make('123456'),
                    'created_at' => now(),
                    'updated_at' => now(),
                    'remember_token' => Str::random(10),
                ],
                [
                    'name' => 'Luiz Jr',
                    'email' => 'luizjrdeveloper@gmail.com',
                    'email_verified_at' => now(),
                    'password' => Hash::make('123456'),
                    'created_at' => now(),
                    'updated_at' => now(),
                    'remember_token' => Str::random(10),
                ],
            ]
        );
    }
}
