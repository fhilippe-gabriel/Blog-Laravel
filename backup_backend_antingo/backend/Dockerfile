### IMAGES SET -----------------------------------------------------------------------------------
FROM composer:latest AS composer
FROM php:7.4.9-apache-buster AS php
### END IMAGES SET -------------------------------------------------------------------------------

###
COPY ./ /var/www/
###

### Config Apache/PHP/COMPOSER -------------------------------------------------------------------
RUN apt-get update
RUN apt-get -fy full-upgrade

RUN apt-get install -fy libfreetype6-dev libzip-dev libjpeg62-turbo-dev libpng-dev \
    && docker-php-ext-configure gd --with-freetype=/usr/include/ --with-jpeg=/usr/include/ \
    && docker-php-ext-install gd

RUN apt-get install -fy libicu-dev \
    && docker-php-ext-install intl

RUN apt-get install -fy libxml2-dev \
    && apt-get install -fy libxslt-dev \
    && docker-php-ext-install xsl \
    && docker-php-ext-install xmlrpc

RUN apt-get install -fy libbz2-dev \
    && docker-php-ext-install bz2

RUN docker-php-ext-install zip \
    && docker-php-ext-install pcntl \
    && docker-php-ext-install pdo_mysql \
    && docker-php-ext-install mysqli \
    && docker-php-ext-install exif \
    && docker-php-ext-install bcmath \
    && docker-php-ext-install calendar \
    && docker-php-ext-install gettext \
    && docker-php-ext-install opcache \
    && docker-php-ext-install sockets

RUN apt-get update && apt-get install -fy libpq-dev \
    && docker-php-ext-install pdo_pgsql \
    && docker-php-ext-install pgsql

RUN apt-get install -fy curl libcurl4-openssl-dev \
    && docker-php-ext-install curl

RUN apt-get install -fy libedit-dev libreadline-dev \
    && docker-php-ext-install readline

RUN apt-get install -fy libgmp-dev \
    && ln -s /usr/include/x86_64-linux-gnu/gmp.h /usr/include/gmp.h \
    && docker-php-ext-install gmp

RUN pecl install redis && docker-php-ext-enable redis
# Composer
RUN curl -sS https://getcomposer.org/installer | php -- --install-dir=/usr/bin/ --filename=composer
ENV COMPOSER_ALLOW_SUPERUSER 1

# # PHP XDebug
# RUN pecl install xdebug-2.8.0
# RUN echo "zend_extension=/usr/local/lib/php/extensions/no-debug-non-zts-20170718/xdebug.so" > /usr/local/etc/php/conf.d/docker-php-ext-xdebug.ini
# RUN echo "xdebug.profiler_enable_trigger = 1" >> /usr/local/etc/php/conf.d/docker-php-ext-xdebug.ini
# RUN echo "xdebug.profiler_enable = 0" >> /usr/local/etc/php/conf.d/docker-php-ext-xdebug.ini
# RUN echo "xdebug.remote_enable = 1" >> /usr/local/etc/php/conf.d/docker-php-ext-xdebug.ini
# RUN echo "xdebug.profiler_output_dir = /tmp" >> /usr/local/etc/php/conf.d/docker-php-ext-xdebug.ini
# RUN docker-php-ext-enable xdebug

RUN a2enmod rewrite \
    && sed -i 's!/var/www/html!/var/www/public!g' /etc/apache2/sites-available/000-default.conf \
    && mv /var/www/html /var/www/public 

RUN chown -hR $user:www-data /var/www
RUN chmod -R 775 /var/www/
RUN chmod -R 777 /tmp
WORKDIR /var/www
### END Config Apache/PHP/COMPOSER ----------------------------------------------------------------
