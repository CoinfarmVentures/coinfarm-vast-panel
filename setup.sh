#!/bin/bash

./setCredentials.sh

echo "Building stack..."
./build.sh

chmod -R 777 grafana/data
chmod -R 777 grafana/provisioning

echo "Starting stack..."
docker compose up -d

echo "Initialization complete. Navigate to http://localhost:5000 to view the panel. Data should appear in a few minutes"
