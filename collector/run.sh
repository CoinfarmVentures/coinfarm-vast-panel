#!/bin/bash

docker rm coinfarm-vast-panel-collector
docker run -d --net=coinfarm-vast-panel-net --name coinfarm-vast-panel-collector -it coinfarm-vast-panel-collector