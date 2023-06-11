#!/bin/bash
git fetch --all
git reset --hard origin/master
echo "Update complete. You may have to run setup.sh again"
