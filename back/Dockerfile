FROM php:8.2-cli

# Fix GPG key issue by importing Debian keys and updating package lists
RUN apt-get update && apt-get install -y --no-install-recommends \
    gnupg \
    && rm -rf /var/lib/apt/lists/* \
    && apt-get clean

# Import Debian repository GPG keys
RUN apt-get update && apt-get install -y --no-install-recommends \
    ca-certificates \
    && apt-key adv --keyserver keyserver.ubuntu.com --recv-keys 648ACFD622F3D138 0E98404D386FA1D9 \
    && rm -rf /var/lib/apt/lists/* \
    && apt-get clean

# Install required dependencies
RUN apt-get update && apt-get install -y --no-install-recommends \
    git \
    zip \
    unzip \
    libzip-dev \
    libonig-dev \
    libxml2-dev \
    && rm -rf /var/lib/apt/lists/* \
    && apt-get clean

# Install PHP extensions
RUN docker-php-ext-install pdo_mysql mbstring xml zip

# Install Composer
COPY --from=composer:latest /usr/bin/composer /usr/local/bin/composer

# Set working directory
WORKDIR /var/www

# Copy application files
COPY . .

# Install Composer dependencies if composer.json exists
RUN if [ -f "composer.json" ]; then composer install --no-dev --optimize-autoloader; else echo "No composer.json found"; fi

# Set permissions (ensure storage and cache are writable)
RUN chown -R www-data:www-data /var/www/storage /var/www/bootstrap \
    && chmod -R 775 /var/www/storage /var/www/bootstrap/cache

# Expose port 8000
EXPOSE 8000

# Run Laravel's built-in server
CMD ["php", "artisan", "serve", "--host=0.0.0.0", "--port=8000"]
