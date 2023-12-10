# coinfarm-vast-panel
A free, powerful monitoring interface for hosts on Vast.ai

![image info](demo1.png)

## Requirements
1. Vast.AI host account
2. Linux OS, or Windows OS with Git Bash/MINGW64
3. Docker (this should already be installed if you're setting this panel up on a rig)
4. 1GB of free memory
5. 5GB of disk space
6. Minimal CPU time (3-4% peak usage on a Ryzen 7 5800x, 0.1-0.2% average)

The Python Vast.ai CLI utility is already included. If it's out of date, please open an issue on Github.

## Setup

Clone this repository. Run `chmod 700 -R setup.sh update.sh build.sh restart.sh updateCredentials.sh updateDb.sh` if you're on Linux

Go to https://cloud.vast.ai/account/ and find your API key.

Navigate to https://cloud.vast.ai/api/v0/users/current/ in your web browser

The 4 or 5-digit `id` field is your user ID. Save it for later.

Run `setup.sh` and enter the credentials above when asked
Come up with a secure root password for MySQL. You can later use the 'root' username with this password to connect to the database manually with MySQL workbench

Navigate to http://localhost:5000/. The initial username is `admin` with the password `admin`. Set a new password after that.

Go to the following page:

`http://localhost:5000/d/ad0bea78-d14c-40af-b6d8-6b98d7effe73/farm-overview?orgId=1&refresh=5m`

This is the main dashboard. You should start to see data from your machines after 10-15 minutes.

## Customization

You can add additional custom dashboards from the same data source or add more panels. But make sure to export them to JSON in case you accidentally delete the application.

## Maintenance

If you need to restart the application, navigate to the root directory (where this README file is), then run the following:

```
docker compose down
docker compose up
```

The stack should automatically restart every time the machine restarts.

If your Vast.ai credentials have expired, which happens if you see a 401 unauthorized Axios error in the collector's logs/output, you need to obtain your user ID and auth token again.

Then run `updateCredentials.sh`. Answer `y` to rebuild the collector. Finally, stop & start the application stack with 

```
docker compose down
docker compose up
```

## Updating

To update to a new version of the application, run `update.sh`. 

If there were changes to the database, you'll have to run `updateDb.sh` after that. Please back up your data using the MySQL Workbench export tool.

## Deleting old machines

If there are machines clogging up the dashboard that you don't want to see anymore, you need to run `deleteMachine.sh`. Data will be permanently lost.
