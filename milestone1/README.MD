# Working logic and POST requests
Using Michael's API and blockly, you can now generate code to read, in real time, the output from Michael's arduino.
Furthermore, the logic now works and waits for a response before continuing to the next block.

# How to test hydroponic system API:
The api is currenly configured to run the following commands:
- read_ph - uses an atlas scientific pH sensor to read the pH of the soil
- read_temp - uses an atlas scientific temperature sensor to read the temperature
- read_DHT - uses a DHT11 sensor to read the humidity and temperature
- LED_ON - turns on the LED
- LED_OFF - turns off the LED

The web server is running entirely off a SINGLE Arduino Uno R4 Wifi. Due to the
limited memory of this, be careful sending requests in a spammy way. The server
will be updated on the backend to be more atomic, but for now, please be careful.
The public IP of the server is 23.243.138.154. To ONLY TEST the API, enter in
this format in your browser:

23.243.138.154:read_ph
23.243.138.154:read_temp
23.243.138.154:read_DHT (the hardware needs a replacement, will be done soon)
23.243.138.154:LED_ON
23.243.138.154:LED_OFF

We are currently working on a digitalread/write, an analogread/write, and other
utilities that will make the API more useful in terms of abstraction, so someone
else could use it without owning specific farming hardware.

It will output a single value, unless specifically directed like read_DHT which
returns humidity and temperature. The server and the electronics will run 24/7.
Due to the nature of this project, Github Pages is not a good option.

The API work is far more important than the front end work, as other groups were able to
just execute code that was previously written. We had to hand wire, hand code,
and piece together electronics in so we would have successful logic execution.
Therefore I strongly recommend that you look more into the value of the API than
the front end.
