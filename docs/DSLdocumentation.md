# Hydroponic Scheduling
https://docs.google.com/presentation/d/1dIQLruPDIwin1Sa0OkognLq0T8XSzdSecS-MJPYo9L4/edit?usp=sharing
## ExpressJS Interpreter
This is the brain/interpreter of the entire project. It take the generated pseudocode blockly and interprets it in code logic which we see every day. It is written in ExpressJS and runs on port 3000.

to run: 'node server.js'
You can send a request to the /executePseudocode with a parameter consisting of an array of commands. run.py is a working demonstration of how to send a request to the server manually.

## Mock Server
Given you don't have your own hydroponic farm at home, you can run a mock server to simulate the behaviour of a hydroponic farm. The mock server runs on port 8080. It outputs fake data unlike the real farm, but is good for testing the expressjs interpreter.

to run,type 'node mockserver.js'
You can tell if it works by going to localhost:8080/relay_on

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