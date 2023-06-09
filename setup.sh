#!/bin/bash

echo "What is your Vast user ID? This must be a number. Refer to README.md"
read -r USER_ID

echo "What is your Vast auth_tkt key in the format 'xxxxxx....userid_type:b64unicode'? Refer to README.md"
read -r AUTH_KEY

CRED_PATH="./collector/credentials.json"

echo "Saving credentials to ${CRED_PATH}..."
echo "{\"authKey\": \"${AUTH_KEY}\", \"userId\": ${USER_ID}}" > $CRED_PATH

echo "Building stack..."
./build.sh

echo "Starting stack..."
docker compose up -d

echo "Initialization complete. Navigate to http://localhost:5000 to view the panel. Data should appear in a few minutes"
