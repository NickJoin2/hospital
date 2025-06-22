FROM php:8.2-fpm-alpine

# Установка базовых расширений Laravel
RUN docker-php-ext-install pdo pdo_mysql opcache

# Установка Composer
RUN curl -sS https://getcomposer.org/installer  | php -- --install-dir=/usr/local/bin --filename=composer

WORKDIR /var/www/html

# Копируем только composer.json
COPY composer.json ./

# Установка зависимостей без использования lock-файла
RUN composer install --no-scripts --no-plugins --no-dev

# Копируем остальные файлы
COPY . .

EXPOSE 8000

CMD ["php", "artisan", "serve", "--host=0.0.0.0", "--port=8000"]
