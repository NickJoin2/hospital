FROM php:8.2-fpm-alpine

# Установка системных зависимостей
RUN apk update && apk add --no-cache \
    linux-headers \
    git \
    curl \
    unzip \
    libpng-dev \
    libjpeg-turbo-dev \
    libwebp-dev \
    zlib-dev \
    icu-dev \
    libzip-dev \
    oniguruma-dev

# Установка PHP расширений
RUN docker-php-ext-configure gd --with-jpeg --with-webp && \
    docker-php-ext-install -j$(nproc) \
    gd \
    pdo \
    pdo_mysql \
    opcache \
    intl \
    bcmath \
    sockets \
    zip \
    mbstring

# Установка Composer
RUN curl -sS https://getcomposer.org/installer | php -- --install-dir=/usr/local/bin --filename=composer

# Рабочая директория
WORKDIR /var/www/html

# Создание директорий и установка прав
RUN mkdir -p /var/www/html/bootstrap/cache \
    && chown -R www-data:www-data /var/www/html/bootstrap/cache \
    && chmod -R 775 /var/www/html/bootstrap/cache

# Проверка существования composer.lock перед копированием
COPY composer.json ./
RUN if [ -f composer.lock ]; then COPY composer.lock ./; fi

# Установка зависимостей
RUN composer install --no-interaction --optimize-autoloader --no-dev

# Копирование остальных файлов
COPY . .

# Установка прав
RUN chown -R www-data:www-data /var/www/html \
    && chmod -R 775 /var/www/html/storage \
    && chmod -R 775 /var/www/html/bootstrap/cache

# Запуск приложения
CMD ["php", "artisan", "serve", "--host=0.0.0.0", "--port=8000"]
