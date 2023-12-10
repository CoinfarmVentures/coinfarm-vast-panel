FROM mysql:8-debian

ARG BUILD_MYSQL_ROOT_PASSWORD

ENV MYSQL_DATABASE=vast \
    MYSQL_ROOT_PASSWORD=BUILD_MYSQL_ROOT_PASSWORD

ADD initial_20231210.sql /docker-entrypoint-initdb.d

#VOLUME ["/var/lib/mysql", "/var/log/mysql"]
