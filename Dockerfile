# No build stage needed — we already built locally!
FROM nginx:alpine

# Copy the already-built dist folder
COPY dist/ /usr/share/nginx/html

# Copy NGINX config
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]