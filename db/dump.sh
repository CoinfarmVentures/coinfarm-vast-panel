#!/bin/bash
TIME=$(date +%s)
"C:\Program Files\MySQL\MySQL Workbench 8.0 CE\mysqldump.exe" -h 127.0.0.1 -u root -p --routines --all-databases > initial_server_${TIME}.sql