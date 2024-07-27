

## Enable node-red on the Vvictron GX

Install the large version of the firmware on the device. And the device will have node-red

'''
https://www.youtube.com/watch?v=i_iaciqn_Fg
'''

Say the victron GX server MQTT data is at https://192.168.0.138:1883/

install node red on a miner
install node-red-contrib-sum in the node red palette

The Victron GX software is emmitting his data as mqtt messages.
MQTT explorer connected to the GX will allow to find the interesting topics as MQTT messages.

Once you have them, no need even to have a node red in your miner control system.
You can program something to catch the messages and apply the miner policy.
