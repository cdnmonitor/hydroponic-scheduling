# Pseudocode for Hydroponic Farms

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