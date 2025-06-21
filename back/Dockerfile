# Используем официальный PHP образ с поддержкой FPM
FROM php:8.2-fpm

# Устанавливаем системные зависимости
RUN apt-get update && apt-get install -y \
    git \
    curl \
    libpng-dev \
    libonig-dev \
    libxml2-dev \
    zip \
    unzip \
    && rm -rf /var/lib/apt/lists/*

# Устанавливаем PHP расширения
RUN docker-php-ext-install \
    pdo \
    pdo_mysql \
    mbstring \
    exif \
    pcntl \
    bcmath \
    gd \
    && docker-php-ext-enable pdo_mysql

# Устанавливаем Composer
COPY --from=composer:latest /usr/bin/composer /usr/bin/composer

# Создаем рабочую директорию
WORKDIR /var/www/html

# Копируем файлы Laravel (кроме указанных в .dockerignore)
COPY . .

# Устанавливаем зависимости (если нужно сразу в образ)
# RUN composer install --no-dev --no-interaction --optimize-autoloader

# Меняем права
RUN chown -R www-data:www-data /var/www/html/storage
RUN chown -R www-data:www-data /var/www/html/bootstrap/cache

# Опционально: очищаем кеш
RUN rm -rf /var/cache/apk/*

# Запускаем PHP-FPM
CMD ["php-fpm"]
