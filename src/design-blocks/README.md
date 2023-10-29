# Blockly Custom Blocks Documentation

This documentation covers a series of custom blocks integrated with Blockly to generate custom JavaScript code for specific tasks.

## Table of Contents
- [`check_ph`](#check_ph)
- [`check_water_level`](#check_water_level)
- [`check_water_temperature`](#check_water_temperature)
- [`enable_relay`](#enable_relay)
- [`disable_relay`](#disable_relay)
- [`read_sensor`](#read_sensor)
- [`number`](#number)
- [`custom_string`](#custom_string)
- [`print`](#print)
- [`compare_values`](#compare_values)
- [`create_number_variable_custom`](#create_number_variable_custom)
- [`create_string_variable_custom`](#create_string_variable_custom)
- [`set_number_variable`](#set_number_variable)
- [`set_string_variable`](#set_string_variable)
- [`get_string_variable` and `get_number_variable`](#get_string_variable-and-get_number_variable)
- [`for_loop_custom`](#for_loop_custom)
- [`append_strings`](#append_strings)

### `check_ph`
Returns the pH level.
```javascript
check_ph
```

### `check_water_level`
Checks the water level.
```javascript
check_water_level
```

### `check_water_temperature`
Returns the water temperature.
```javascript
check_water_temp
```

### `enable_relay`
Enables a relay.
```javascript
enable_relay
```

### `disable_relay`
Disables a relay.
```javascript
disable_relay
```

### `read_sensor`
Reads the sensor value.
```javascript
check_sensor
```

### `number`
Returns a number from the block field value. 
- **Example**: If the block's field value is `5`, the generated code will be `5`.

### `custom_string`
Returns a custom string from the block field value.
- **Example**: If the block's field value is `hello`, the generated code will be `"hello"`.

### `print`
Prints the given value.
- **Example**: Using the block with a value of `Hello World`, the generated code will be `print "Hello World"`.

### `compare_values`
Compares two values with the specified operator.
- **Example**: Comparing `a` and `b` with the operator `==`, the generated code will be `a == b`.

### `create_number_variable_custom`
Creates a custom number variable.
- **Example**: Given the variable name `myNum` and value `10`, the generated code will be `num myNum(10)`.

### `create_string_variable_custom`
Creates a custom string variable.
- **Example**: Given the variable name `myStr` and value `Hello`, the generated code will be `str myStr("Hello")`.

### `set_number_variable`
Sets the value of a number variable.
- **Example**: Given the variable name `myNum` and value `20`, the generated code will be `myNum = 20;`.

### `set_string_variable`
Sets the value of a string variable.
- **Example**: Given the variable name `myStr` and value `World`, the generated code will be `myStr = "World";`.

### `get_string_variable` and `get_number_variable`
Retrieves the value of a string or number variable.
- **Example**: Given the variable name `myStr`, the generated code will be `myStr`.

### `for_loop_custom`
Generates a custom for-loop from a specified starting to ending value.
- **Example**: Looping from `1` to `10`, the generated code will be:
```javascript
for num1 to num2 {
    // Code inside the loop
}
```

### `append_strings`
Appends multiple strings together.
- **Example**: Given strings `Hello`, ` `, and `World`, the generated code will be `Hello + " " + World`.

---

To use these blocks, drag them into the Blockly workspace and connect them to generate the desired pseudocode.

--- 

## Example Program

```javascript
num num1(check_ph)
num num2(10)

for num1 to num2 {
  if (num1 == 19) {
    enable_relay
  }
  disable_relay
}

num1 = (10 - check_water_temp)
```

---