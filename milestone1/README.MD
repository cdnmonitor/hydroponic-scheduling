# How to test hydroponic system API:
The api is currenly configured to run the following commands:
- read_ph
- read_temp
- read_DHT
- LED_ON
- LED_OFF

The web server is running entirely off a SINGLE Arduino Uno R4 Wifi. Due to the
limited memory of this, be careful sending requests in a spammy way. The server
will be updated on the backend to be more atomic, but for now, please be careful.
The public IP of the server is 23.243.138.154. To ONLY TEST the API, enter in
this format in your browser:
23.243.138.154:read_ph

It will output a single value, unless specifically directed like read_DHT which
returns humidity and temperature. The server and the electronics will run 24/7.
Due to the nature of this project, Github Pages is not a good option.

The API work is far more important than the front end work, as other groups were able to
just execute code that was previously written. We had to hand wire, hand code,
and piece together electronics in so we would have successful logic execution.
Therefore I strongly recommend that you look more into the value of the API than
the front end.