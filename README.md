# Solarmining

Mining cryptos on solar pannels. Starting and stopping devices in regard to available power.
The goal is to "burn" all the excess power with the miners.
Financially it is equivalent to selling this power to the grid.

## Context

Victron installation with batteries and solar pannels.
Octominers x9 with radeon 6600, using hiveos.
Orange pi computer with node-red.

## Usage

The Victron system reports the available solar power and battery power through a node-red server.
The Orange pi has also a node red server and his flow will be to "burn" the excess power into the miners.

'''
If excess power is available burn it.
If no power is available and the battery has power, use it to a certain point. As instance 5%.
We can add more conditions, like open source weather/powerprice forecast apps as presented at Fosdem.
'''

We only start and stop whole miners so we have gaps of roughly 1kw. 
We will use hysteresis to avoid starting and stopping the miners too often.

## Starting and stopping miners

Using Hiveos rest API, we can start and stop a running miner app, or we can shutdowm the computer.
The calls are made from node red.
Shutting down a miner may be usefull to spare the Hiveos fee for the day, and also the idle power consumption.
But we must enable the wake on lan property in order to boot it later. Wake on lan uses the device MAC address.

Because we do not want to start and stop miners all the time, we will iddle them for a wile before shutting them dowm.
A minimum of one miner will be iddle, say that this miner is the miner running node-red.


