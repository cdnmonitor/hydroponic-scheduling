const express = require('express');

const app = express();
const mockPort = 8080;

// Utility function to get a random number between min and max
function getRandom(min, max) {
    return Math.floor(Math.random() * (max - min + 1) + min);
}

// Fake endpoint for relay_on
app.get('/relay_on', (req, res) => {
    console.log("Mock: relay_on called");
    res.send('Relay is ON');
});

// Fake endpoint for relay_off
app.get('/relay_off', (req, res) => {
    console.log("Mock: relay_off called");
    res.send('Relay is OFF');
});

// Fake endpoint for DHT_temp
app.get('/DHT_temp', (req, res) => {
    console.log("Mock: DHT_temp called");
    res.send(String(getRandom(45, 95)));  // Random temperature between 45°F and 95°F
});

// Fake endpoint for DHT_humid
app.get('/DHT_humid', (req, res) => {
    console.log("Mock: DHT_humid called");
    res.send(String(getRandom(30, 80)));  // Random humidity between 30% and 80%
});

// Fake endpoint for read_temp
app.get('/read_temp', (req, res) => {
    console.log("Mock: read_temp called");
    res.send(String(getRandom(45, 95)));  // Same temperature range as DHT
});

// Fake endpoint for read_ph
app.get('/read_ph', (req, res) => {
    console.log("Mock: read_ph called");
    res.send(String(getRandom(6.5, 8.5)));  // Random pH value between 6.5 and 8.5
});

app.listen(mockPort, () => {
    console.log(`Mock Arduino server running at http://localhost:${mockPort}/`);
});
