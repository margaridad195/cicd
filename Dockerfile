# Simple Dockerfile for a basic web server
FROM nginx:alpine
COPY . /usr/share/nginx/html
