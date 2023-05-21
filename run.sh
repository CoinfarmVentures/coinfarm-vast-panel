#!/bin/bash

echo "Starting application... ('Error: no such container' is normal)"
RUNNING_CONTAINERS=$(docker ps)

if ! [[ $RUNNING_CONTAINERS = *"coinfarm-vast-panel-db"* ]]; then
    echo "Starting db container..."
	docker start coinfarm-vast-panel-db
else
	echo "DB container is already running"
fi

if ! [[ $RUNNING_CONTAINERS = *"coinfarm-vast-panel-collector"* ]]; then
    echo "Starting collector container..."
	docker start coinfarm-vast-panel-collector
else
	echo "collector container is already running"
fi

if ! [[ $RUNNING_CONTAINERS = *"coinfarm-vast-panel-grafana"* ]]; then
    echo "Starting grafana container..."
	docker start coinfarm-vast-panel-grafana
else
	echo "grafana container is already running"
fi

echo "Application started"
