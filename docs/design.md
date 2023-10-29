# Design Protocol

## Overview
This project hosts an ESP32 connected to the internet that recieves and sends data via REST API calls.
This data is sent and recieved using Blockly API, making the system easier to program and use.

## Parts
- ESP32
- 12v Aquarium pump
- 12v Relays
- 12v Power supply
- DC-DC Buck converter
- A farm of your choice

## Basic Blocks
The following sends data to another API as it is being ran, to control the ESP32
- `Enable Relay` - Enables a relay specifically aquarium pumps or lights
- `Disable Relay` - Disables a relay specifically aquarium pumps or lights
- `Read Sensor` - Reads a sensor and returns the value

The following are logic based blocks
- `If` - If a condition is met, run the following blocks
- `If Else` - If a condition is met, run the following blocks, otherwise run the blocks in the else section
- `While` - While a condition is met, run the following blocks
- `For` - For a certain amount of times, run the following blocks