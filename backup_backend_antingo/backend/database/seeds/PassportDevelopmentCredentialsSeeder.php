<?php

use Laravel\Passport\Client;
use Illuminate\Database\Seeder;

class PassportDevelopmentCredentialsSeeder extends Seeder
{
    public function run()
    {
        factory(Client::class)->create();
    }
}
