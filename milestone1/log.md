# Work Distribution
## Michael Bishai did the following:
- Wrote the code for the API
- Wired the electronics per voltage and current requirements
- Wrote the code for the electronics
- [Michael's work](https://github.com/cdnmonitor/hydroponic-scheduling/blob/main/milestone1/arduinoAPI/arduinoAPI.ino)
## AI Used:
- ChatGPT was used to figure out how to wire the electronics. The original schematic
    used an ESP32 which required Tx and Rx pins to be used. This is a problem because
    when flashing the ESP32, the Tx and Rx pins need to be disconnected. This extra
    concern of setup risks the project. The advice given was used to change hardware.

- ChatGPT was used to help configure the WIFI. Given that The arguino R4 is a new
    board, there is not much documentation on how to use it. The advice given was
    used to use WIFININA library to connect to the internet. This library was not useful,
    but after showing some documentation, I was able to get help setting up specific
    libraries to connect to the internet, given this has to run 24/7 with a port open.


## Marco Costa did the following:
- Added generate and save code buttons
- Updated and added blockly library to fix errors reguarding default blocks
- Wrote POST requests and asynchronous fetching functions for several blocks
- Transitioned several blocks to accept object promises which is not supported by blockly by default

## AI Used:
- ChatGPT was used for general questioning reguarding the blockly API and provided usefull insight into potential error causes.
