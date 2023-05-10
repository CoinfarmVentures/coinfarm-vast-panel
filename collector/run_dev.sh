#!/bin/bash
#docker run -p 3000:3000 -p 3306:3306 --rm coinfarm-vast-panel systemctl start grafana-server

docker run --rm --net=coinfarm-vast-panel-net --name coinfarm-vast-panel-collector -it coinfarm-vast-panel-collector