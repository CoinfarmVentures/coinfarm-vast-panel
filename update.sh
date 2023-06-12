#!/bin/bash
git fetch --all
git reset --hard origin/master
chmod -R 777 grafana/data
chmod -R 777 grafana/provisioning
chmod 700 -R setup.sh update.sh build.sh restart.sh
echo "Update complete. You probably have to run restart.sh"
