# Block Based Hydroponic Scheduling
## Group Members:
- [x] 1.  [Michael Bishai]()
- [x] 2.  [Marco Costa]() 

## Links
* https://www.youtube.com/watch?v=zTmWMJnVgPo&feature=youtu.be
* https://www.youtube.com/watch?v=kYgATCUaSII&feature=youtu.be
* https://cdnmonitor.github.io/hydroponic-scheduling/src/design-blocks/

## Functionality
* https://github.com/cdnmonitor/hydroponic-scheduling/blob/main/docs/DSLdocumentation.md

## Project Description:
This project looks into writing software that converts functions done by an arduino
into a remotely managed API that is easy to control and manage via Blockly API.
Functions like controlling pins and reading data can be organized into blocks that
any regular person can understand and use with little to 0 chance of error.

The interest of this assignment is taking the Domain Specific Language we made and having it run in realtime with a microcontroller, or a server that would be open to reading data. We discuss this later, but to simulate and run tests, we wrote our own server as well as a live Arduino farm.

Project functions as follows:
1. Arduino Uno R4 Wifi is hosting API that controls pins and reads data
2. Some of these functions include light functionality, water pump functionality, and
   reading data from sensors like a light or PH sensor.
3. Blockly API is written to use the API per block and collect the returned information.
4. ExpressJS server recieves request, and the server calls on the arduino farm to do the obligations the Blockly user intended.

## Project Relations to Programming Languages:
The way the programs work require a knowledge of how parsing works, and basic algebra theory.
Every single asset requires being activated and deactivated, and requires a sense or order that has to be followed.
Compilation is very important in the case of this project, as not writing proper functionality for sensors and pins which
can then be defied by manual user lack of knowledge can risk in the destruction of the hardware and decalibration of the sensors.
Writing the pseudocode which became a domain specific language is the most important part of the project.
Everything that was written for the Arduino API had to be written into the ExpressJS server, and the Blockly website.

## Testing
Michael has been writing a working Arduino Farm, but has also written a mock server for the use of testing the pseudolanguage.

## Functionality
<img width="834" alt="chart" src="https://github.com/cdnmonitor/hydroponic-scheduling/assets/52522568/566acd88-76b7-4159-84c1-eb53a975a2a1">

## ExpressJS Interpreter AND HOW TO RUN!
This is the brain/interpreter of the entire project. It take the generated pseudocode blockly and interprets it in code logic which we see every day. It is written in ExpressJS and runs on port 3000.

to run Interperter: 'node server.js'
to run mock server: 'node mockserver.js'
NOTE: BOTH MUST RUN TO HAVE A WORKING DSL INTERPRETATION.

You can send a request to the /executePseudocode with a parameter consisting of an array of commands. run.py is a working demonstration of how to send a request to the server manually.

## Mock Server
Given you don't have your own hydroponic farm at home, you can run a mock server to simulate the behaviour of a hydroponic farm. The mock server runs on port a port which you can modify in the server.js file. It outputs fake data unlike the real farm, but is good for testing the expressjs interpreter.

to run,type 'node mockserver.js'
You can tell if it works by going to localhost:8080/relay_on or whatever port you must use.

## Pseudocode for Hydroponic Farms

1. **Variable Assignment**

To assign a value to a variable:

```vbnet
SET variable_name TO value

```

- `variable_name`: Name of the variable.
- `value`: The integer value to assign to the variable.

Example:

```vbnet
SET x TO 5

```

1. **Conditional Statements (If, Else-If, Else)**

The structure for conditional statements is:

```scss
IF condition
    command(s)
ELSE IF another_condition
    command(s)
ELSE
    command(s)
END_IF

```

Example:

```sql
IF x > 3
    relay_on
ELSE IF x == 2
    relay_off
ELSE
    read_temp
END_IF

```

1. **Loops**

There are two types of loops supported:


a) **For Loop:**

```css
FOR variable FROM start_value TO end_value
    command(s)
END_FOR

```

Example:

```css
FOR i FROM 1 TO 5
    relay_on
END_FOR

```

b) **While Loop:**

```scss
WHILE condition
    command(s)
END_WHILE

```

Note: The server imposes a maximum iteration limit to avoid infinite loops. The default is 50 iterations.

Example:

```markdown
WHILE x < 10
    read_ph
END_WHILE

```

1. **Conditions**

The following operators are supported in conditions:

- `>`: Greater than
- `<`: Less than
- `==`: Equal to
- `!=`: Not equal to
- `<=`: Less than or equal to
- `>=`: Greater than or equal to

Conditions can be combined using:

- `AND`: Logical AND
- `OR`: Logical OR
- `NOT`: Logical NOT

Example:

```markdown
IF x > 5 AND y < 3

```

1. **Arduino Commands**

The following commands interface directly with the Arduino:

- `relay_on`: Activates a relay.
- `relay_off`: Deactivates a relay.
- `read_dht`: Reads from a DHT sensor. Returns a value.
- `read_temp`: Reads the temperature. Returns a value.
- `read_ph`: Reads the pH level. Returns a value.

When these commands are executed, the server will send a GET request to the respective endpoint on the Arduino to either activate a device or retrieve sensor data.

1. **Usage**

To execute pseudocode, send it as an array of strings to the `/executePseudocode` endpoint on the server using a GET request. Each command or statement should be a separate element in the array.

1. **Notes**
- Always ensure that loops have an `END_FOR` or `END_WHILE` to mark the end of their blocks.
- Always ensure that conditional statements have an `END_IF` to mark the end of their blocks.
1. Cycle a relay on and off five times

```css
FOR i FROM 1 TO 5
    relay_on
    relay_off
END_FOR

```

1. Activate the relay if the humidity is below a certain level

Assuming the `read_dht` command returns humidity data:

```scss
read_dht
IF read_dht < 40
    relay_on
END_IF

```

## How to add features
To add a feature, you must decide what level of abstraction you need to reach. If you want to include a new form of data, then you must edit the Arduino API written in C as well as done wiring to the specific desire. You can add a new endpoint to the API with the functionality you've written, and then add that endpoint to the logic of the ExpressJS server. If you want to test without the farm, then you need to make some mock data functions up and put them in mockserver.js. Everything done in code has to be added to blockly ultimately.

1. Edit ArduinoAPI.ino with a function and add an else if endpoint to the endpoint chain. Verify the endpoint works as is.
2. Add endpoint as a new word in server.js. Make sure all names are unique. Eg. TEMPON: temperature.
3. Add the new block in custom_blocks.js

# Contributions
* Marco Costa did the Blockly website
* Michael Bishai built the Arduino API, API Tests, Pseudocode Tests, all farming functions, and the demonstration farm.

# Future Work
I (Michael) intend on working on a hydroponic focused version built not off blockly, but with the same server and arduino complements. This ideally can be the backbone for a proper scheduling software for my farm, which can be freely replicated in the future.
