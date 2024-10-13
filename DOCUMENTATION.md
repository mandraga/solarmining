

## Enable MQTT output on the Victron GX

Install the large version of the firmware on the device.

```
https://www.youtube.com/watch?v=i_iaciqn_Fg
```
A tutorial is on this repo: https://gist.github.com/KidA001/dc5584db340cf3ad513f9415b20ed5fa

It is suposed to enable the MQTT broker, however, on my system it did not give all the messages at first. It was like only a serial number.
In fact, a keep alive message is required in order to get all the messages.

To enable the secure shell on the GerboGX or use a raspberry pi:
https://youtu.be/3KhZvcBjq7M?si=aQWfbnbZJI1yQpD6
Venus os setup helper:
https://github.com/kwindrem/SetupHelper

The shell will be usefull to store the config files onboard.

Say the victron GX server MQTT data is at https://192.168.0.138:1883/

### Enable node-red on a machine

* Install node red on a computer, miner or not.
* Install node-red-contrib-sum in the node red palette.
* Setup nodered to start at boot: https://nodered.org/docs/faq/starting-node-red-on-boot

### Enable node-red on the GerboCX

Just install the large VenusOS image, and enabel MQTT and modbus in "VenusOS Large" settings.
Enable ssh access to be able to copy the configration files.

## MQTT

The Victron GX software is emmitting his data as mqtt messages.
MQTT explorer connected to the GX will allow you to find the interesting topics as MQTT messages.
However, a keep aline is needed https://imval.tech/index.php/blog/victron-mqtt-server-bridging. 
Variables will be PV power, battery state of charge, and currently used AC power.
This data will be processed to deduce the available power.

# Get your Hiveos rest API key

Log in your Hiveos account, go to sessions and create a personnal token.
The token will be used to send rest API calls to te Hiveos servers.

![alt text](https://github.com/mandraga/solarmining/blob/main/pictures/getAPIToken.png)

## Test stopping the miner through the rest API

First API test, sample script.
```
accessToken=ODY4o2doy-u78d4iodiot84itdtiy8i642t8it4irgwergmiwqeoifR4GER5HWqEGWRY2HWREHEsTJRTJR6gs8574t2y84yta864yv874aty2XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXYourAccessTokenLookslikethis
baseUrl=https://api2.hiveos.farm/api/v2
curl -v -s -w "\n%{http_code}" \
         -H "Content-Type: application/json" \
         -H "Authorization: Bearer $accessToken" \
         "$baseUrl/farms"
```

To shutdown completely the rig 125 on farm 354561460, no wake on lan available then.

```
MYFARM=354561460
curl -v -s -w "\n%{http_code}" \
         -H "Content-Type: application/json" \
         -H "Authorization: Bearer $accessToken" \
         "$baseUrl/farms/$MYFARM/workers/command" \
         -d '{ "worker_ids": [ 125 ], "data": { "command": "shutdown", "data": {} }}'
```

### Suspending a miner if your system has it, not like octominers 9

```
systemctl suspend
or
halt
```
Wake on lan using the MAC address

Wake on lan must be enable on eth0 interface and in the bios.
Enable wake on lan on the miner
From https://photostructure.com/coding/wake-on-lan/
```
ethtool -s eth0 wol g
```
```
wakeonlan "00:e0:4c:ef:97:e2"
```
However, on octominer, the fans will not stop and on power on, the GPUs will be unstable.
Using an external ESP32 interface on the front pannel header, switching off/on on a mqtt packet, may work.

## Mining control

We can simply run the miners all day and start mining when energy is available.
At the end of the day we stop the rigs while planing to power them on in the morning through the bios.
Powering the rigs on timer with the bios is the only option on octominer 9.
A weather forecast would be also usefull to shutdown miners directly in the morning.

Stop or start mining.

```
curl -v -s -w "\n%{http_code}" \
         -H "Content-Type: application/json" \
         -H "Authorization: Bearer $accessToken" \
         "$baseUrl/farms/$MYFARM/workers/command" \
         -d '{ "worker_ids": [ 125 ], "data": { "command": "miner", "data": { "action": "stop"} }}'
```

#### Stop the machine for a while

In console, this reboots after 2 minutes
```
sreboot wakealarm 120
```

In console, this should reboot after 10 hours
```
sreboot wakealarm 36000
```

#### Stop in the evening, reboot in the morning

We can put something in cron, such as it stops at 17h to boot at 9h.
The bios can boot at a precise hour, but it must be set by hand in the bios menu.
In Hiveos, crontab is rewritten at boot, we can use an extra user crontab file.

crontab -e -u user

* Stop minimg at 17h
0 17 * * * /usr/sbin/miner stop
* Start the servers at 9h, 16 hours later
4 17 * * * /usr/sbin/sreboot wakealarm 57600

As we see here, we only mine 8hours out of 24h. Therefore, battery storage is very usefull.
Instead of crontab or the bios, we use javascript from node-red to decide to stop the rigs.
The current time will be used to plan a reboot from alarm at something like 9am when we produce again.
A rig will stop at the end of the day or when the battery reaches a given level.

### Stop the rig using the rest API, bios reboot after some seconds

```
curl -v -s -w "\n%{http_code}" \
         -H "Content-Type: application/json" \
         -H "Authorization: Bearer $accessToken" \
         "$baseUrl/farms/$MYFARM/workers/command" \
         -d '{ "worker_ids": [ 125 ], "data": { "command": "shutdown", "data": { "wakealarm": 120 } }}'
```

### Getting the powered miners list

We want to know which miner has booted and is available.

```
curl -v -s -w "\n%{http_code}" \
         -H "Content-Type: application/json" \
         -H "Authorization: Bearer $accessToken" \
         "$baseUrl/farms/$MYFARM/workers/preview"
```

This request returns the list of the farm workers and if they are online (powered on).
It is a json containing this:
```
"{"id":12345678,"farm_id":12345788,"platform":1,"name":"RIG_3050",ip_addresses":["192.168.1.55"],"stats":{"online":true}}
```

### Puting the farmid and accesstoken in a file for js use

The access token and farm id sample files are in access_sample.json.
Mine are in the confidentiel/ folder and excluded by .gitignore

### Sample API quey in javascript

miner_info.js demonstrates a request, prepare your config file as named in the code (../confidentiel/access.json), change the workerid in your code, and run it like this:

```
$ cd nodejs_src
$ node miner_info.js
```

"workerid" can be picked from the worker list reqest.

## Miners configuration file

As defined in minerpower_sample.json, you create ./confidentiel/minerpower.json
You will set your batery's max discharge rate, and maximum discharge power.
And a list of all your miners, as given by "Getting the powered miners list".

You will specify a low consumption estimate, it will be updated at runtime if a greater value is found.

"phase" is your electrical phases, set to 1 if in monophased.
It will be used later to balance consumption loads.

## Set the idle power in hiveos

The idle power is not that precisely monitored, you can configure it in the worker parameters in hiveos.

![alt text](https://github.com/mandraga/solarmining/blob/main/pictures/setidlepower.png)

## Set the mining start delay in hiveos

Because the miners sleep by 20 minutes intervals while battery is low during the day, they must not mine directly on alarm start.
This saves the battery, and mining for 4 minutes is useless.
So add 300 seconds to every miner in their hiveos configuration, such as they will be shutdown without mining if the battery is low.

![alt text](https://github.com/mandraga/solarmining/blob/main/pictures/minerdelayatstart.png)

