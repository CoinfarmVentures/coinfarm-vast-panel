#!/bin/bash

echo "Define a new root password for MySQL (you will never see this again so write it down):"
read -r BUILD_MYSQL_ROOT_PASSWORD

$(echo $BUILD_MYSQL_ROOT_PASSWORD > db/password_sql.txt)

echo "Rebuilding DB..."
cd db
./build.sh

echo "Rebuild complete. You will have to stop/start the application stack"
rm db/password_sql.txt
