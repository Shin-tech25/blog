FROM nginx

COPY public/  /usr/share/nginx/html/

CMD ["/usr/sbin/nginx", "-g", "daemon off;"]
