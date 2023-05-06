#!/bin/bash

mysqld --verbose --help
mysqld --user=root &
P1=$!
systemctl start grafana-server &
P2=$!
wait $P1 $P2
