const express = require('express');
const axios = require('axios');
const bodyParser = require('body-parser');

const app = express();
const port = process.env.PORT || 3000;

// Constants and configuration
const MAX_WHILE_ITERATIONS = 50;
const ARDUINO_IP = "http://localhost:8080/";

// Endpoints for Arduino interaction
const ENDPOINTS = {
  "relay_on": "relay_on",
  "relay_off": "relay_off",
  "DHT_temp": "DHT_temp",
  "DHT_humid": "DHT_humid",
  "read_temp": "read_temp",
  "read_ph": "read_ph"
};

app.use(bodyParser.json());

let results = [];
let latestResponses = {};
let failedRequestCount = 0;

// Custom error class for pseudocode execution errors
class PseudocodeExecutionError extends Error {
  constructor(message) {
    super(message);
    this.name = "PseudocodeExecutionError";
  }
}

// Function to execute pseudocode
async function executePseudocode(pseudocode, variables) {
  for (let i = 0; i < pseudocode.length; i++) {
    try {
      const line = pseudocode[i].trim();

      // Variable assignment
      if (line.startsWith("SET ")) {
        const parts = line.split(" TO ");
        const varName = parts[0].split(" ")[1];
        if (ENDPOINTS[parts[1]]) {
          await processAction(parts[1], variables);
          variables[varName] = variables[parts[1]];
        } else {
          variables[varName] = parseFloat(parts[1]);
        }
      }

      // If condition
      else if (line.startsWith("IF ")) {
        const condition = line.split("IF ")[1];
        if (evaluateCondition(condition, variables)) {
          i++; // Move to the next line
          while (!pseudocode[i].startsWith("END_IF") && !pseudocode[i].startsWith("ELSE")) {
            await processAction(pseudocode[i], variables);
            i++;
          }
        } else {
          while (!pseudocode[i].startsWith("END_IF") && !pseudocode[i].startsWith("ELSE")) {
            i++;
          }
        }
      }
      // For loop
      else if (line.startsWith("FOR ")) {
        const parts = line.split(" ");
        const start = parseInt(parts[3]);
        const end = parseInt(parts[5]);
        let loopEnd = i + 1;

        while (!pseudocode[loopEnd].startsWith("END_FOR")) {
          loopEnd++;
        }

        for (variables[parts[1]] = start; variables[parts[1]] <= end; variables[parts[1]]++) {
          for (let j = i + 1; j < loopEnd; j++) {
            await processAction(pseudocode[j], variables);
          }
        }

        i = loopEnd;
      }
      // While loop
      else if (line.startsWith("WHILE ")) {
        const condition = line.split("WHILE ")[1];
        let loopEnd = i + 1;
        let iterationCount = 0;

        // find loop end
        while (!pseudocode[loopEnd].startsWith("END_WHILE")) {
          loopEnd++;
        }

        while (evaluateCondition(condition, variables)) {
          if (iterationCount++ >= MAX_WHILE_ITERATIONS) {
            throw new Error(`WHILE loop exceeded maximum iterations of ${MAX_WHILE_ITERATIONS}. Exiting loop.`);
          }

          for (let j = i + 1; j < loopEnd; j++) {
            await processAction(pseudocode[j], variables);
          }
        }

        i = loopEnd; // Move the iterator to the loop end
      } else {
        await processAction(line, variables);
      }
    } catch (error) {
      throw new PseudocodeExecutionError(error.message);
    }
  }
}

app.post('/executePseudocode', async (req, res) => {
  try {
    const pseudocode = req.body.pseudocode;
    const variables = {};

    // Execute pseudocode and get results
    const result = await executePseudocode(pseudocode, variables);

    // Respond with success and results
    res.json({ message: 'Pseudocode executed successfully', result });
  } catch (error) {
    console.error('Error executing pseudocode:', error);
    if (error instanceof PseudocodeExecutionError) {
      res.status(400).json({ error: 'Pseudocode execution error', message: error.message });
    } else {
      res.status(500).json({ error: 'Internal server error', message: error.message });
    }
  }
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
