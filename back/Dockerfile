FROM php:8.2-cli

# Сначала обновляем ключи репозиториев
RUN apt-get update && apt-get install -y --no-install-recommends \
    ca-certificates \
    && rm -rf /var/lib/apt/lists/* \
    && apt-get clean

# Затем устанавливаем зависимости
RUN apt-get update && apt-get install -y \
    git \
    zip \
    unzip \
    libzip-dev \
    libonig-dev \
    libxml2-dev

# Установка расширений PHP
RUN docker-php-ext-install pdo_mysql mbstring xml zip

# Установка Composer
COPY --from=composer:latest /usr/bin/composer /usr/bin/composer

# Рабочая директория
WORKDIR /var/www

# Копируем файлы приложения
COPY . .

# Установка зависимостей Composer (пропускаем шаг, если нет composer.json)
RUN [ -f "composer.json" ] && composer install || echo "No composer.json found"

# Запуск встроенного сервера PHP
CMD ["php", "artisan", "serve", "--host=0.0.0.0", "--port=8000"]
