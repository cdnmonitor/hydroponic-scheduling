const express = require('express');
const axios = require('axios');
const bodyParser = require('body-parser');

const app = express();
const port = 3000;

const MAX_WHILE_ITERATIONS = 50;
const ARDUINO_IP = "http://localhost:8080/";
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
let latestResponses = {}; // Capture the latest response from each endpoint action


app.post('/executePseudocode', async (req, res) => {
    try {
        const pseudocode = req.body.pseudocode;
        const variables = {};

        for (let i = 0; i < pseudocode.length; i++) {
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
        }

        const formattedResults = results.map(r => {
            const { action, endpointResponse, variablesBefore } = r;
            let summary = `${action} was executed.`;

            if (ENDPOINTS[action]) {
                summary += ` Endpoint returned: ${endpointResponse}.`;
            }

            const variableChanges = Object.entries(variablesBefore)
                .filter(([key, value]) => variables[key] !== value)
                .map(([key, value]) => `${key} changed from ${value} to ${variables[key]}`);

            if (variableChanges.length) {
                summary += ` ${variableChanges.join('. ')}.`;
            }

            return summary;
        });

        res.send({ message: 'Pseudocode executed successfully.', details: formattedResults });

        // After sending the response, reset the results array for the next execution
        results = [];

    } catch (error) {
        res.status(500).send('Error executing pseudocode: ' + error.message);
    }
});


let failedRequestCount = 0; // Counter for consecutive failed requests

async function processAction(line, variables) {
    if (ENDPOINTS[line]) {
        try {
            const {
                data,
                status
            } = await axios.get(ARDUINO_IP + ENDPOINTS[line]);

            if (status !== 200) {
                failedRequestCount++;
            } else {
                // If request is successful, reset the counter
                failedRequestCount = 0;
            }

            // Use the data directly since the response is a plain string
            latestResponses[line] = data;

            results.push({
                action: line,
                endpointResponse: latestResponses[line],
                variablesBefore: { ...variables }
            });

            // If the data is a number string, convert it to a number
            const parsedData = isNaN(latestResponses[line]) ? latestResponses[line] : parseFloat(latestResponses[line]);
            variables[line] = parsedData;

            // If failed requests exceed 10, throw an error
            if (failedRequestCount >= 10) {
                throw new Error('Exceeded 10 consecutive failed requests.');
            }

        } catch (error) {
            console.error(`Error processing action ${line}:`, error.message);
            failedRequestCount++;
            if (failedRequestCount >= 10) {
                throw new Error('Exceeded 10 consecutive failed requests.');
            }
        }        
    }
    else if (line.includes(" + ") || line.includes(" - ") || line.includes(" * ") || line.includes(" / ")) {
        const parts = line.split(" ");
        const varName = parts[0];
        const operation = parts[1];
        const operand = isNaN(parts[2]) ? variables[parts[2]] : parseInt(parts[2]);

        switch (operation) {
            case "+":
                variables[varName] += operand;
                break;
            case "-":
                variables[varName] -= operand;
                break;
            case "*":
                variables[varName] *= operand;
                break;
            case "/":
                if (operand === 0) {
                    throw new Error("Division by zero is not allowed.");
                }
                variables[varName] /= operand;
                break;
        }
    }
}


function evaluateCondition(condition, variables) {
    condition = condition.trim();

    // Handle AND
    if (condition.includes(" AND ")) {
        const subconditions = condition.split(" AND ");
        return evaluateCondition(subconditions[0], variables) && evaluateCondition(subconditions[1], variables);
    }

    // Handle OR
    if (condition.includes(" OR ")) {
        const subconditions = condition.split(" OR ");
        return evaluateCondition(subconditions[0], variables) || evaluateCondition(subconditions[1], variables);
    }

    // Handle NOT
    if (condition.startsWith("NOT ")) {
        return !evaluateCondition(condition.replace("NOT ", ""), variables);
    }

    // Handle simple comparison
    const parts = condition.split(" ");
    if (parts.length === 3) {
        let left = isNaN(parts[0]) ? (variables[parts[0]] || latestResponses[parts[0]]) : parseFloat(parts[0]);
        let right = isNaN(parts[2]) ? (variables[parts[2]] || latestResponses[parts[2]]) : parseFloat(parts[2]);

        switch (parts[1]) {
            case ">":
                return left > right;
            case "<":
                return left < right;
            case "==":
                return left == right;
            case "<=":
                return left <= right;
            case ">=":
                return left >= right;
            case "!=":
                return left != right;
            default:
                return false;
        }
    }

    // Handle single TRUE or FALSE
    if (condition === "TRUE") return true;
    if (condition === "FALSE") return false;

    return false;
}

app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}/`);
});