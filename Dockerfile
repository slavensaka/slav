FROM php:8.2-apache
COPY . /var/www/html/
# Set Apache DocumentRoot to portfolio folder
RUN sed -i "s|DocumentRoot /var/www/html|DocumentRoot /var/www/html/portfolio|" /etc/apache2/sites-available/000-default.conf \
    && sed -i "s|<Directory /var/www/html>|<Directory /var/www/html/portfolio>|" /etc/apache2/apache2.conf
EXPOSE 80
