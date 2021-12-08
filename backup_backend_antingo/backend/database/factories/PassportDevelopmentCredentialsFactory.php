<?php

use Carbon\Carbon;
use Laravel\Passport\Client;

$factory->define(Client::class, function () {
    return [
        'name' => 'DevSGO',
        'secret' => 'b89f58iIL45t8ftsaqGQUXm3LLFP4xO75FbSc9Dc',
        'redirect' => 'http://127.0.0.1',
        'personal_access_client' => 0,
        'password_client' => 1,
        'revoked' => 0,
        'created_at' => Carbon::now(),
        'updated_at' => Carbon::now()
    ];
});
