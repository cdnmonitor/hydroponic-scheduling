# Design2
## How the Blockly will be executed
The Blockly will be executed by the following steps:
1. User uses the blocks in the UI to create a program or schedule
2. The program or schedule is converted into a JSON object
3. The JSON object is sent to the server
4. The ESP32 receives the JSON object and executes the program or schedule based on the JSON object
## How the Blockly will be implemented
The ESP32 will be running ESPAsyncWebServer (https://github.com/me-no-dev/ESPAsyncWebServer), which is an asynchronous web server library for the ESP32. The ESP32 will be running a web server that awaits requests from the UI. The UI is hosted on a web server running on the ESP32. The UI will send a JSON object to the ESP32, which will be parsed and executed by the ESP32.
eg. If a user has a function that checks the light rating through a pin sensor, and then uses an if else statement to turn the lights off or to lower their brightness, the ESP32 reads it as:
    Read data from SENSOR_PIN

    IF data from SENSOR_PIN meets condition (e.g., is above a threshold):
        Turn on the LED array (set LED_ARRAY_PIN to HIGH)
    ELSE:
        Turn off the LED array (set LED_ARRAY_PIN to LOW)

    Wait for a short interval (e.g., 500 milliseconds) before repeating

## Recursion
The Blockly API will be written for recursion by having two levels of depth: Read/write pin commands which are low level, and function commands like "Check Water Level" which can recursively run to guarantee water level is always considered.

## Data
The ESP32 will be sending and recieving data to and from many devices. The ESP32 will be connected to lights, watering, and many sensors. So, when the ESP32 reads a pin, it can be reading water level, or ph level, etc. Additionally, the data sent from the ESP32 can vary the intensity of light, or flow of water. The Blockly API will write code to take this input and have decision trees it can follow to make sure a plant stays healthy.

## How the Blockly will be tested
https://wokwi.com/projects/new/esp32
Emulation software for ESP32. We can use this to test our code without having to use hardware immediately.

Hardware
ESP32s are cheap and we are near a local distributor. We can test as is.