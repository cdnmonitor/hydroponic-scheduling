const express = require('express');

const app = express();
const mockPort = 8080;

// Utility function to get a random number between min and max
function getRandom(min, max) {
    return Math.floor(Math.random() * (max - min + 1) + min);
}

/// Fake endpoint for relay_on
app.get('/relay_on', (req, res) => {
    console.log("Mock: relay_on called");
    const response = 'Relay is ON';

    // Request Handling Check
    if (typeof response !== 'string') {
        console.error("Invalid response for 'relay_on' endpoint.");
        res.status(500).send('Internal Server Error');
    } else {
        res.send(response);
    }
});

// Fake endpoint for relay_off
app.get('/relay_off', (req, res) => {
    console.log("Mock: relay_off called");
    const response = 'Relay is OFF';

    // Request Handling Check
    if (typeof response !== 'string') {
        console.error("Invalid response for 'relay_off' endpoint.");
        res.status(500).send('Internal Server Error');
    } else {
        res.send(response);
    }
});

// Fake endpoint for DHT_temp
app.get('/DHT_temp', (req, res) => {
    console.log("Mock: DHT_temp called");
    const response = String(getRandom(45, 95));  // Random temperature between 45°F and 95°F

    // Request Handling Check
    if (isNaN(response)) {
        console.error("Invalid response for 'DHT_temp' endpoint.");
        res.status(500).send('Internal Server Error');
    } else {
        res.send(response);
    }
});

// Fake endpoint for DHT_humid
app.get('/DHT_humid', (req, res) => {
    console.log("Mock: DHT_humid called");
    const response = String(getRandom(30, 80));  // Random humidity between 30% and 80%

    // Request Handling Check
    if (isNaN(response)) {
        console.error("Invalid response for 'DHT_humid' endpoint.");
        res.status(500).send('Internal Server Error');
    } else {
        res.send(response);
    }
});

// Fake endpoint for read_temp
app.get('/read_temp', (req, res) => {
    console.log("Mock: read_temp called");
    const response = String(getRandom(45, 95));  // Same temperature range as DHT

    // Request Handling Check
    if (isNaN(response)) {
        console.error("Invalid response for 'read_temp' endpoint.");
        res.status(500).send('Internal Server Error');
    } else {
        res.send(response);
    }
});

// Fake endpoint for read_ph
app.get('/read_ph', (req, res) => {
    console.log("Mock: read_ph called");
    const response = String(getRandom(6.5, 8.5));  // Random pH value between 6.5 and 8.5

    // Request Handling Check
    if (isNaN(response)) {
        console.error("Invalid response for 'read_ph' endpoint.");
        res.status(500).send('Internal Server Error');
    } else {
        res.send(response);
    }
});

app.listen(mockPort, () => {
    console.log(`Mock Arduino server running at http://localhost:${mockPort}/`);
}).on('error', (err) => {
    if (err.code === 'EADDRINUSE') { // Check port is available
        console.error(`Port ${mockPort} is already in use.`);
        process.exit(1);
    }
});