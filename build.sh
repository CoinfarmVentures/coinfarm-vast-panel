#!/bin/bash

echo "Define a root password for MySQL (you will never see this again):"
read -r BUILD_MYSQL_ROOT_PASSWORD

echo "Composing stack... "
docker-compose -p "coinfarm-vast-panel" build --build-arg BUILD_MYSQL_ROOT_PASSWORD=$BUILD_MYSQL_ROOT_PASSWORD
