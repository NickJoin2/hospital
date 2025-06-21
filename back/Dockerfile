FROM php:8.2.1-fpm

RUN apt-get -y update && apt-get upgrade -y
RUN docker-php-ect-install pdo pdo_mysql && docker-php-ext-enable pdo_mysql
CMD ["php-fpm"]
