FROM php:8.2-apache

# Instalace PDO MySQL a SQLite rozšíření pro plnou kompatibilitu s freehostingem i lokální DB
RUN apt-get update && apt-get install -y \
    libsqlite3-dev \
    && docker-php-ext-install pdo pdo_mysql pdo_sqlite mysqli \
    && a2enmod rewrite \
    && rm -rf /var/lib/apt/lists/*

WORKDIR /var/www/html
COPY . /var/www/html/

RUN chown -R www-data:www-data /var/www/html/database
EXPOSE 80
