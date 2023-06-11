#!/bin/bash
git fetch --all
git reset --hard origin/master
chmod 700 -R setup.sh update.sh build.sh restart.sh
echo "Update complete. You may have to run setup.sh again"
