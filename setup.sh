#!/bin/bash

echo "Creating Docker network..."
docker network create -d bridge coinfarm-vast-panel-net

echo "What is your Vast user ID? This must be a number. Refer to README.md"
read -r USER_ID

echo "What is your Vast auth_tkt key in the format 'xxxxxx....userid_type:b64unicode'? Refer to README.md"
read -r AUTH_KEY

CRED_PATH="./collector/credentials.json"

echo "Saving credentials to ${CRED_PATH}..."
echo "{\"authKey\": \"${AUTH_KEY}\", \"userId\": ${USER_ID}}" > $CRED_PATH

echo "Building collector..."
cd collector
./build.sh
echo "Starting collector for the first time..."
./run.sh
cd ..

echo "Building db..."
cd db
./build.sh
echo "Starting db for the first time..."
./run.sh
cd ..

echo "Building grafana..."
cd grafana
./build.sh
echo "Starting grafana for the first time..."
./run.sh
cd ..

echo "Build complete. Navigate to http://localhost:5000 to view the panel"
