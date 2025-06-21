FROM php:8.2.1-fpm-alpine

# Обновляем пакеты
RUN apt-get update && apt-get upgrade -y

# Устанавливаем необходимые расширения
RUN docker-php-ext-install pdo pdo_mysql

# Включаем расширение (не всегда нужно, так как install уже делает это)
RUN docker-php-ext-enable pdo_mysql

CMD ["php-fpm"]
