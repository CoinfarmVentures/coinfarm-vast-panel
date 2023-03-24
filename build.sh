#!/bin/bash

# export BUILD_MYSQL_ROOT_PASSWORD=ffff

docker build -t coinfarm-vast-panel . --build-arg BUILD_MYSQL_ROOT_PASSWORD=$(cat password_sql.txt)

# docker run -p 3000:3000 -p 3306:3306 --rm coinfarm-vast-panel systemctl start grafana-server