# Usar la imagen oficial de Nginx como base
FROM nginx:alpine

# Borrar la configuración por defecto de Nginx
RUN rm /etc/nginx/conf.d/default.conf

# Copiar nuestra configuración personalizada (la que arregla los caracteres)
COPY nginx.conf /etc/nginx/nginx.conf

# Copiar todos los archivos de nuestra web (html, css, js, assets)
COPY . /usr/share/nginx/html

# Exponer el puerto 80 para que la web sea visible
EXPOSE 80