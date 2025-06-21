FROM php:8.2-fpm-alpine

# Установка зависимостей
RUN apk update && apk add --no-cache \
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

# Копируем ВСЁ содержимое локальной директории в /var/www/html
COPY . .

# Проверяем, существует ли artisan
RUN if [ ! -f "artisan" ]; then echo "ERROR: artisan file is missing"; exit 1; fi

# Устанавливаем зависимости
RUN composer install --no-interaction --optimize-autoloader --no-dev
# Запуск приложения
CMD ["php", "artisan", "serve", "--host=0.0.0.0", "--port=8000"]
