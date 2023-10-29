const express = require('express');

const app = express();
const mockPort = 8080;  // Different port from the main server

// Fake endpoint for relay_on
app.get('/relay_on', (req, res) => {
    console.log("Mock: relay_on called");
    res.send({ value: 'Relay is ON' });  // Sending back fake data
});

// Fake endpoint for relay_off
app.get('/relay_off', (req, res) => {
    console.log("Mock: relay_off called");
    res.send({ value: 'Relay is OFF' });
});

// Fake endpoint for read_dht
app.get('/DHT_temp', (req, res) => {
    console.log("Mock: read_dht called");
    res.send({ value: '50' });  // Example humidity value
});

// Fake endpoint for read_dht
app.get('/DHT_humid', (req, res) => {
    console.log("Mock: read_dht called");
    res.send({ value: '50' });  // Example humidity value
});

// Fake endpoint for read_temp
app.get('/read_temp', (req, res) => {
    console.log("Mock: read_temp called");
    res.send({ value: '25' });
});

// Fake endpoint for read_ph
app.get('/read_ph', (req, res) => {
    console.log("Mock: read_ph called");
    res.send({ value: '7' });
});

app.listen(mockPort, () => {
    console.log(`Mock Arduino server running at http://localhost:${mockPort}/`);
});
