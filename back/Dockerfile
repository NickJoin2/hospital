FROM php:8.2-cli

# Обновляем ключи репозиториев и устанавливаем gnupg
RUN apt-get update && apt-get install -y --no-install-recommends \
    gnupg \
    ca-certificates \
    && apt-key adv --keyserver keyserver.ubuntu.com --recv-keys 648ACFD622F3D138 0E98404D386FA1D9 \
    && rm -rf /var/lib/apt/lists/* \
    && apt-get clean

# Устанавливаем зависимости
RUN apt-get update && apt-get install -y --no-install-recommends \
    git \
    zip \
    unzip \
    libzip-dev \
    libonig-dev \
    libxml2-dev \
    && rm -rf /var/lib/apt/lists/* \
    && apt-get clean

# Устанавливаем расширения PHP
RUN docker-php-ext-install pdo_mysql mbstring xml zip

# Устанавливаем Composer
COPY --from=composer:latest /usr/bin/composer /usr/local/bin/composer

# Устанавливаем рабочую директорию
WORKDIR /var/www

# Копируем файлы приложения
COPY . .

# Устанавливаем зависимости Composer, если есть composer.json
RUN if [ -f "composer.json" ]; then composer install --no-dev --optimize-autoloader; else echo "No composer.json found"; fi

# Устанавливаем права доступа для Laravel
RUN chown -R www-data:www-data /var/www/storage /var/www/bootstrap/cache \
    && chmod -R 775 /var/www/storage /var/www/bootstrap/cache

# Открываем порт
EXPOSE 8000

# Запускаем встроенный сервер PHP
CMD ["php", "artisan", "serve", "--host=0.0.0.0", "--port=8000"]
