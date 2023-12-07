const express = require('express');
const app = express();
const port = 80;

// Mock data for simulation
let relayState = false;
let humidity = 50.0; // Dummy humidity value
let temperature = 22.0; // Dummy temperature value
let phValue = 7.0; // Dummy pH value

app.use(express.json());

app.post('/humidity', (req, res) => {
  console.log('Received request on /humidity');
  res.json({ response: humidity });
  console.log('Sent response:', humidity);
});

app.post('/temperature', (req, res) => {
  console.log('Received request on /temperature');
  let calibratedTemp = temperature - 1.3; // Simulate calibration
  res.json({ response: calibratedTemp });
  console.log('Sent response:', calibratedTemp);
});

app.post('/probeTemperature', (req, res) => {
  console.log('Received request on /probeTemperature');
  res.json({ temperature: temperature });
  console.log('Sent response:', temperature);
});

app.post('/relay_on', (req, res) => {
  console.log('Received request on /relay_on');
  relayState = true;
  res.json({ response: "Relay turned on" });
  console.log('Relay turned on');
});

app.post('/relay_off', (req, res) => {
  console.log('Received request on /relay_off');
  relayState = false;
  res.json({ response: "Relay turned off" });
  console.log('Relay turned off');
});

app.post('/ph', (req, res) => {
  console.log('Received request on /ph');
  res.json({ response: phValue });
  console.log('Sent response:', phValue);
});

// Simulate pH calibration endpoints
app.post('/calibrate/ph/:type', (req, res) => {
  let type = req.params.type;
  console.log(`Received pH calibration request with type: ${type}`);
  let responseMessage = `pH ${type}-point calibration done`;
  if (type === 'clear') {
    responseMessage = 'pH calibration cleared';
  }
  res.json({ response: responseMessage });
  console.log('Sent response:', responseMessage);
});

app.use((req, res) => {
  console.log('Received unsupported request method');
  res.status(404).json({ error: "Unsupported request method." });
});

app.listen(port, () => {
  console.log(`Mock server running at http://localhost:${port}`);
});
