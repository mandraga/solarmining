

## Enable MQTT output on the Victron GX

Install the large version of the firmware on the device.

```
https://www.youtube.com/watch?v=i_iaciqn_Fg
```

Say the victron GX server MQTT data is at https://192.168.0.138:1883/

## Enable node-red on a machine

* Install node red on a computer, miner or not.
* Install node-red-contrib-sum in the node red palette.
* Setup nodered to start at boot: https://nodered.org/docs/faq/starting-node-red-on-boot

The Victron GX software is emmitting his data as mqtt messages.
MQTT explorer connected to the GX will allow you to find the interesting topics as MQTT messages.
They will be PV power, battery state of charge, and currently used AC power.
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

## PV production forecast rest API

We must know our production profile.
Then we get a PV production forecast to shutdown immediately the rigs who will not mine during the day. The battery will store the excess power if any.
TODO



