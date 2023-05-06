#!/bin/bash
#docker run -p 3000:3000 -p 3306:3306 --rm coinfarm-vast-panel systemctl start grafana-server

docker run -p 3000:3000 -p 3306:3306 -e MYSQL_ROOT_HOST=% -e MYSQL_ROOT_PASSWORD=ffff --rm coinfarm-vast-panel