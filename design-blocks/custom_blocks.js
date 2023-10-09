Blockly.Blocks['check_ph'] = {
    init: function () {
        this.appendDummyInput()
            .appendField("Check pH Level");
        this.setOutput(true, "Number"); // This block outputs a value of type "Number"
        this.setColour(60);
    }
};

// Check Water Level
Blockly.Blocks['check_water_level'] = {
    init: function () {
        this.appendDummyInput()
            .appendField("Check Water Level");
        this.setOutput(true, "Number");
        this.setColour(90);
    }
};

// Check Water Temperature
Blockly.Blocks['check_water_temperature'] = {
    init: function () {
        this.appendDummyInput()
            .appendField("Check Temperature");
        this.setOutput(true, "Number"); // This block outputs a value of type "Number"
        this.setColour(120);  // I'm using a different color for differentiation. You can adjust as needed.
    }
};


Blockly.Blocks['enable_relay'] = {
    init: function () {
        this.appendDummyInput()
            .appendField("Enable Relay");
        this.setPreviousStatement(true, null); // This block does not return a value, but it can connect to blocks before...
        this.setNextStatement(true, null);     // ...and after it
        this.setColour(180);  // Adjust color as needed
    }
};

Blockly.Blocks['disable_relay'] = {
    init: function () {
        this.appendDummyInput()
            .appendField("Disable Relay");
        this.setPreviousStatement(true, null);
        this.setNextStatement(true, null);
        this.setColour(180);
    }
};

Blockly.Blocks['read_sensor'] = {
    init: function () {
        this.appendDummyInput()
            .appendField("Read Sensor");
        this.setOutput(true, "Number");
        this.setColour(210);
    }
};

Blockly.Blocks['number'] = {
    init: function () {
        this.appendDummyInput()
            .appendField(new Blockly.FieldTextInput("0", this.validateNumber), "NUM");
        this.setOutput(true, "Number");
        this.setColour(240);
    },
    validateNumber: function (number) {
        // Ensure that the input is a valid number.
        // If not, return null to reject the change.
        return (isNaN(number) ? null : String(number));
    }
};

Blockly.Blocks['print'] = {
    init: function () {
        this.appendValueInput("PRINT")
            .setCheck(null)
            .appendField("print");
        this.setPreviousStatement(true, null);
        this.setNextStatement(true, null);
        this.setColour(260);
    }
};

Blockly.Blocks['compare_values'] = {
    init: function() {
        this.appendValueInput("VALUE1")
            .setCheck("Number")
            .appendField("Compare");
        this.appendValueInput("VALUE2")
            .setCheck("Number");
        this.appendDummyInput()
            .appendField(new Blockly.FieldDropdown([["==", "EQ"], ["!=", "NEQ"], ["<", "LT"], [">", "GT"], ["<=", "LTE"], [">=", "GTE"]]), "OP");
        this.setOutput(true, "Boolean");
        this.setColour(210);  // A color value
        this.setTooltip('Compares two values.');
        this.setHelpUrl(''); // Link to a help document if needed
    }
};


var apiEndpoint = "http://23.243.138.154";
Blockly.JavaScript['check_ph'] = function (block) {
    var code = `(async function() {
        try {
            let response = await fetch("${apiEndpoint}/read_ph");
            if (response.ok) {
                return parseFloat(await response.text());
            }
        } catch (error) {
            console.error('Error fetching pH:', error);
        }
        return -1;  // default in case of errors
    })()`;
    return [code, Blockly.JavaScript.ORDER_FUNCTION_CALL];
};



Blockly.JavaScript['check_water_level'] = function (block) {
    return 'sendPostRequest("/api/checkWaterLevel");\n';
};

Blockly.JavaScript['check_water_temperature'] = function (block) {
    var code = `(async function() {
        try {
            let response = await fetch("${apiEndpoint}/read_temp");
            if (response.ok) {
                return parseFloat(await response.text());
            }
        } catch (error) {
            console.error('Error fetching temperature:', error);
        }
        return -1;  // default in case of errors
    })()`;
    return [code, Blockly.JavaScript.ORDER_FUNCTION_CALL];
};


Blockly.JavaScript['enable_relay'] = function (block) {
    var code = `(async function() {
        try {
            await fetch("${apiEndpoint}/enable_relay");
        } catch (error) {
            console.error('Error enabling relay:', error);
        }
    })();\n`;  // Using "\n" to ensure the next block (if any) starts on a new line
    return code;
};

Blockly.JavaScript['disable_relay'] = function (block) {
    return 'sendPostRequest("/api/disableRelay");\n';
};

Blockly.JavaScript['read_sensor'] = function (block) {
    return 'sendPostRequest("/api/readSensor");\n';
};

Blockly.JavaScript['number'] = function (block) {
    var number = block.getFieldValue('NUM');
    return [number, Blockly.JavaScript.ORDER_ATOMIC];
};

Blockly.JavaScript['print'] = function (block) {
    var value_to_print = Blockly.JavaScript.valueToCode(block, 'PRINT', Blockly.JavaScript.ORDER_ATOMIC);

    // Check if the value_to_print is a Promise, if so, await it.
    var code = `
        (async function() {
            let value = ${value_to_print};
            if (value instanceof Promise) {
                value = await value;
            }
            printToOutput(value);
        })();\n`;

    return code;
};

Blockly.JavaScript['compare_values'] = function(block) {
    var value_value1 = Blockly.JavaScript.valueToCode(block, 'VALUE1', Blockly.JavaScript.ORDER_ATOMIC);
    var dropdown_op = block.getFieldValue('OP');
    var value_value2 = Blockly.JavaScript.valueToCode(block, 'VALUE2', Blockly.JavaScript.ORDER_ATOMIC);
    
    // Convert Blockly operator representation to JavaScript operators
    var ops = {
        'EQ': '==',
        'NEQ': '!=',
        'LT': '<',
        'GT': '>',
        'LTE': '<=',
        'GTE': '>='
    };
    var op = ops[dropdown_op];

    // Handle the comparison in a way that waits for promises
    var code = `
    (async function() {
        let resolvedValue1 = ${value_value1};
        if(resolvedValue1 instanceof Promise) {
            resolvedValue1 = await resolvedValue1;
        }

        let resolvedValue2 = ${value_value2};
        if(resolvedValue2 instanceof Promise) {
            resolvedValue2 = await resolvedValue2;
        }

        return resolvedValue1 ${op} resolvedValue2;
    })()
    `;

    return [code, Blockly.JavaScript.ORDER_FUNCTION_CALL];
};

/*Blockly.JavaScript['print'] = function(block) {
    var value_to_print = Blockly.JavaScript.valueToCode(block, 'PRINT', Blockly.JavaScript.ORDER_ATOMIC);
    var code = `
        (async function() {
            let resolvedValue = await ${value_to_print}; // Resolve promise
            printToOutput(resolvedValue);
        })();\n`;
    return code;
};*/

