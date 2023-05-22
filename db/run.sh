#!/bin/bash

docker run -d -p 5001:3306 --net=coinfarm-vast-panel-net --name coinfarm-vast-panel-db -it coinfarm-vast-panel-db
