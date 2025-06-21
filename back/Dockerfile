# Используем официальный PHP образ с поддержкой FPM
FROM php:8.2-fpm

# Обновляем пакеты
RUN apt-get update && apt-get upgrade -y

# Устанавливаем PDO и MySQL расширения
RUN docker-php-ext-install pdo pdo_mysql

# Включаем расширение (если не включается автоматически)
RUN docker-php-ext-enable pdo_mysql

# Запускаем PHP-FPM
CMD ["php-fpm"]
