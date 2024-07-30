# Solarmining

Mining cryptos on solar pannels. Starting and stopping devices in regard to available power.
The goal is to "burn" all the excess power with the miners.
Financially it is equivalent to selling this power to the grid.

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
Octominers 9 do not support wake on lan. We can take profit of the boot on alarm function.
When the battery is empty we check the PV forecast and set a bios boot on alarm in one or more days.


### Example with 12 miners:

Today we have 4kw of excess power, and no battery: at 9h we start 10 miners, 2 are mining at 800 Watts.

At noon, 10 are mining and using 4kw.

At 16h, 5 are mining.

At the end of the day, 19h, the forecast shows 2kw of peak power, we will restart 5 miners tomorrow and 12 in two days.

In two days, we wake the 12 miners and shutdown some of them depending on the forecast.

