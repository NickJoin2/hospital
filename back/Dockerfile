FROM php:8.2-fpm-alpine

# Копируем скомпилированные расширения из builder
COPY --from=builder /usr/local/etc/php/conf.d /usr/local/etc/php/conf.d
COPY --from=builder /usr/local/lib/php/extensions /usr/local/lib/php/extensions

# Включаем расширения
RUN docker-php-ext-enable \
    pdo_mysql \
    mbstring \
    intl \
    xml

# Установка Composer
RUN curl -sS https://getcomposer.org/installer  | php -- --install-dir=/usr/local/bin --filename=composer

# Рабочая директория
WORKDIR /var/www/html

# Команда по умолчанию (можно изменить под себя)
CMD ["php-fpm"]
