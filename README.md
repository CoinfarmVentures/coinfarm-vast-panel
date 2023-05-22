# coinfarm-vast-panel
A free, powerful monitoring interface for hosts on Vast.ai

Currently all data will be deleted every time the service is restarted, but this will be fixed very soon

## Requirements
1. Vast.AI host account
2. Linux OS or Windows OS with Git Bash/MINGW64
3. Docker (this should already be installed if you're setting this panel up on a rig)
4. 1GB of free memory
5. 5GB of disk space

## Setup

Navigate to https://cloud.vast.ai/host/machines/# in your web browser

Open the debugging console with 'inspect element'. Enter this code: 

`document.cookie.match(/auth_tkt=(.*b64unicode);/i)[0].split("auth_tkt=")[1].split(";")[0]`

The output is your authentication token. Save it for later

Navigate to https://cloud.vast.ai/api/v0/users/current/ in your web browser

The 4 or 5-digit `id` field is your user ID. Save it for later.

Run `setup.sh` and enter the preceding credentials when asked
Come up with a secure root password for MySQL. You can use this password with the 'root' username to connect to the database manually with MySQL workbench

Navigate to http://localhost:5000/. The initial username is `admin` with the password `admin`. Set a new password after that.

Go to the following page:

`http://localhost:5000/d/ad0bea78-d14c-40af-b6d8-6b98d7effe73/farm-overview?orgId=1&refresh=5m`

This is the main dashboard. You should start to see data from your account after 10-15 minutes.

## Customization

You can add additional custom dashboards from the same data source or add more panels. But make sure to export them to JSON in case you accidentally delete the application.

## Maintenance

If you need to restart the application, navigate to the root directory (where this README file is), then run the following:

```
docker-compose down
docker-compose up
```

For now, if the machine or rig restarts, this service will NOT be restarted. You'll have to manually run `docker-compose up`