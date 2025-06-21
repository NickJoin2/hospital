FROM php:8.2-fpm-alpine

# Установка только самых необходимых зависимостей
RUN apk add --no-cache --virtual .build-deps \
    $PHPIZE_DEPS \
    oniguruma-dev \
    libxml2-dev \
    && apk add --no-cache \
    git \
    curl \
    libzip-dev \
    icu-dev \
    && docker-php-ext-install \
    pdo_mysql \
    mbstring \
    intl \
    xml \
    && apk del .build-deps

# Установка Composer (без копирования из образа)
RUN curl -sS https://getcomposer.org/installer | php -- --install-dir=/usr/local/bin --filename=composer

WORKDIR /var/www/html
