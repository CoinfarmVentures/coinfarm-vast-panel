#!/bin/bash

#--rm 
docker run -d -p 5000:3000 --net=coinfarm-vast-panel-net --name coinfarm-vast-panel-grafana -it grafana/grafana
