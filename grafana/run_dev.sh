#!/bin/bash

#docker run -p 5000:3000 --rm --net=coinfarm-vast-panel-net --name coinfarm-vast-panel-grafana -it coinfarm-vast-panel-grafana

docker run -p 5000:3000 --rm --net=coinfarm-vast-panel-net --name coinfarm-vast-panel-grafana -it grafana/grafana
