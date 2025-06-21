FROM php:8.2.1-fpm-alpine

# Установка зависимостей системы
RUN apk update && \
    apk add --no-cache \
        git \
        curl \
        unzip \
        libpng-dev \
        libjpeg-turbo-dev \
        libwebp-dev \
        zlib-dev \
        icu-dev && \
    docker-php-ext-configure gd --with-jpeg --with-webp --with-zlib && \
    docker-php-ext-install -j$(nproc) gd pdo pdo_mysql opcache intl bcmath sockets

# Установка Composer
RUN curl -sS https://getcomposer.org/installer  | php -- --install-dir=/usr/local/bin --filename=composer

# Установка рабочей директории
WORKDIR /var/www/html

# Создание директории для кэша Laravel
RUN mkdir -p /var/www/html/bootstrap/cache && \
    chmod -R 777 /var/www/html/bootstrap/cache

# Копируем исходные файлы проекта
COPY . .

# Установка зависимостей через Composer
RUN composer install --no-dev --optimize-autoloader

# Убедимся, что права на storage и bootstrap/cache корректны
RUN chown -R www-data:www-data /var/www/html && \
    chmod -R 777 /var/www/html/storage /var/www/html/bootstrap/cache

CMD ["php", "-a", "artisan", "serve", "--host=0.0.0.0"]
