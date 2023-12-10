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

function build_collector {
    cd collector 
	./build.sh
	cd ..
}

echo "What is your Vast user ID? This must be a number. Refer to README.md"
read -r USER_ID

echo "What is your hexadecimal Vast.ai API key? Refer to README.md"
read -r API_KEY

CRED_PATH="./collector/credentials.json"

echo "Saving credentials to ${CRED_PATH}..."
echo "{\"apiKey\": \"${API_KEY}\", \"userId\": ${USER_ID}}" > $CRED_PATH

echo "Would you like to rebuild the collector? If this is the first-time setup, say 'n'. If you are updating the credentials, say 'y'"

yes_or_no "$message" && build_collector
exit 0
