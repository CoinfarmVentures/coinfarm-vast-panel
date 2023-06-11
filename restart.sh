#!/bin/bash

echo "Stopping application (if already running)"
docker compose down
echo "Starting application..."
docker compose up -d
echo "Application started"
