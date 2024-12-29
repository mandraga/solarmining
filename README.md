# Solarmining

Mining cryptos on solar pannels. Starting and stopping devices in regard to available power.
The goal is to "burn" all the excess power with the miners.
Financially, thid is equivalent to selling this power to the grid.

## Context

Victron/Fronius installation with batteries and solar pannels.
Octominers x9 with radeon 6600, using hiveos.
Orange pi computer with node-red.

## Usage

The solar system reports the available solar power, used power, and battery charge through MQTT.
The Orange pi node red server flow will "burn" the excess power using the miners.

'''
If excess power is available: burn it by starting miners.
If no power is available and the battery has power, use it to a certain point. As instance 20%.
We can add more conditions, like open source weather/powerprice forecast apps as presented at Fosdem.
'''

We only start and stop whole miners so we have gaps of roughly 1kw. 
We will use hysteresis to avoid starting and stopping the miners too often.

## Starting and stopping miners

Using Hiveos rest API, we can start and stop a running miner app, or we can shutdowm the computer.
The calls are made from node red.
Shutting down a miner may be usefull to spare the Hiveos fee for the day, and also the idle power consumption.
Octominers 9 do not support wake on lan, but can take profit of the boot on alarm function.
When the battery is empty we set a bios boot on alarm in one or more days.


### Installation

. Enable the large Venus image
. Edit your config files from the sample files. Add your installation ID, machines, and Hiveos keys.
. Enable SSH on your Venus
. SCP the config files to ~/solarmining/confidentiel/
. Enable the node red on your Venus
. Connect to the node red and copy Flow victron available power.json Flow ManageHiveosMiners.json into new flows
. Edit the Mqtt nodes to use your system address.
. Deploy

### Example of what it could do with 12 miners:

Today we have 4kw of excess power, and no battery: at 9h we boot 10 miners, 2 are mining at 800 Watts the 8 others are iddle.

At noon, 10 are mining and using 4kw.

At 16h, 5 are mining and 5 are iddle.

At the end of the day, 19h, the forecast shows 2kw of peak power, we will restart 5 miners tomorrow and 12 in two days.

In two days, we wake the 12 miners and shutdown some of them depending on the forecast.

### Storage

We can by more miners and pannels, or have more storage, but all in all you must produce 3 times what you mine in order to mine 24h/24h.
You can also use the grid and use solar only during the day, but then you only need an inverter.

