#!/bin/bash
TIME=$(date +%s)
mysqldump -h 127.0.0.1 -u root -p --routines --all-databases > initial_server_${TIME}.sql