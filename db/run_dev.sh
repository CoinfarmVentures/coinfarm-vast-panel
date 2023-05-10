#!/bin/bash

docker run -p 3306:3306 --rm --net=coinfarm-vast-panel-net --name coinfarm-vast-panel-db -it coinfarm-vast-panel-db
