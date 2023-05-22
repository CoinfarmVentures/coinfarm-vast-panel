#!/bin/bash

docker rm coinfarm-vast-panel-grafana --force
docker run -d -p 5000:3000 --rm --net=coinfarm-vast-panel-net --name coinfarm-vast-panel-grafana -it grafana/grafana
