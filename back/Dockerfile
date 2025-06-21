FROM php:8.2.1-fpm-alpine

# Устанавливаем необходимые зависимости для сборки расширений
RUN apk add --no-cache \
    gcc \
    g++ \
    make \
    autoconf \
    automake \
    libtool \
    musl-dev \
    mysql-dev

# Обновляем индекс пакетов и обновляем системы (через apk, а не apt-get)
RUN apk update && apk upgrade

# Устанавливаем PHP-расширения PDO и MySQL
RUN docker-php-ext-install pdo pdo_mysql

# CMD ["php-fpm"] — уже указан в базовом образе, поэтому не обязательно повторять
