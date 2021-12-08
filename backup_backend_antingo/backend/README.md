# SisSGO

## To developers

- Antes de iniciar o servidor da aplicação faça:

```bash
# Execute todas as migrações
php artisan migrate

# Se precisar, pode popular  o banco com o comando com este comando
php artisan db:seed

# Gere um cliente Passport, com esse token poderar consumir a API
php artisan passport:client --password
php artisan passport:key
```

- Testes:  

```bash
# Para executar os testes use
vendor/bin/phpunit --config phpunit.xml

# Para criar um teste de Integração/Funcionalidade
php artisan make:test UserTest
  
# Para criar um teste unitário
php artisan make:test UserTest --unit
```

- Usando o Laravel Artisan

```bash
# Criar novo model e seus recursos: controller, factory, seeder
php artisan make:model NomeDoControler -c -f -s -r --api
php artisan make:migration create_example_table --create=ExampleTable
```

## Sistema de Permissão

1. Administrador Empresa
2. Administrador do sistema -> Tudo nos sistema da Empresa
3. Administrador de projetos -> Tudo no projeto
4. Usuário Geral
    1. Operador -> Faz lançamentos
    2. Espectador -> Apenas visualiza

## Anotações gerais

[Versionador de Banco de dados](http://www.liquibase.org)
