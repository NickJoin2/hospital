FROM php:8.2-fpm-alpine3.20

# Установка зависимостей
RUN apk update --retry 3 && \
    apk add --no-cache \
        git \
        curl \
        unzip \
        libpng-dev \
        libjpeg-turbo-dev \
        libwebp-dev \
        zlib-dev \
        icu-dev

# Установка расширений PHP
RUN docker-php-ext-configure gd --with-jpeg --with-webp && \
    docker-php-ext-install -j$(nproc) gd pdo pdo_mysql opcache intl bcmath sockets

# Рабочая директория
WORKDIR /var/www/html

# Создание нужных директорий
RUN mkdir -p /var/www/html/bootstrap/cache

# Копируем содержимое локальной директории
COPY . .

# Проверяем наличие файла artisan
RUN if [ ! -f "artisan" ]; then echo "ERROR: artisan file is missing"; exit 1; fi

# Устанавливаем зависимости
RUN composer install --no-interaction --optimize-autoloader --no-dev

# Запуск приложения
CMD ["php", "artisan", "serve", "--host=0.0.0.0", "--port=8000"]
