# Block Based Hydroponic Scheduling
## Group Members:
- [x] 1.  [Michael Bishai]()

## Project Description:
This project looks into writing software that converts functions done by an arduino
into a remotely managed API that is easy to control and manage via Blockly API.
Functions like controlling pins and reading data can be organized into blocks that
any regular person can understand and use with little to 0 chance of error.

Project should function as follows:
1. Arduino or ESP32 is hosting API that controls pins and reads data
2. Some of these functions include light functionality, water pump functionality, and
   reading data from sensors like a light or PH sensor.
3. Blockly API is written to use the API per block and collect the returned information.

## Project Relations to Programming Languages:
The way the programs work require a knowledge of how parsing works, and basic algebra theory.
Every single asset requires being activated and deactivated, and requires a sense or order that has to be followed.
Compilation is very important in the case of this project, as not writing proper functionality for sensors and pins which
can then be defied by manual user lack of knowledge can risk in the destruction of the hardware and decalibration of the sensors.