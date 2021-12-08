# !/bin/bash
php artisan migrate
php artisan db:seed
php artisan passport:client --password
php artisan passport:key
