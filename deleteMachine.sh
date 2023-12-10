#!/bin/bash

function yes_or_no {
    while true; do
        read -p "$* [y/n]: " yn
        case $yn in
            [Yy]*) return 0  ;;  
            [Nn]*) echo "Aborted" ; return  1 ;;
        esac
    done
}

echo "What is the hostname of the machine to delete? This can either be a string like 'monster3090' or a number like 15453"
read -r MACH_NAME

DB_CONTAINER_ID=$(docker ps -q -f "ancestor=coinfarm-vast-panel-db")

echo "Container ID = ${DB_CONTAINER_ID}"
echo "Are you sure you want to permanently delete the vitals, earning history and occupancy history for machine ${MACH_NAME}? y/n"

yes_or_no "$message" && 
	docker exec -it $DB_CONTAINER_ID mysql -u collector -pcollector -e "DELETE FROM vast.machines WHERE Hostname = '${MACH_NAME}'"

exit 0
