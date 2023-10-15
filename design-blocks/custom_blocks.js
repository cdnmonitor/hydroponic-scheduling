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

Blockly.Blocks['string'] = {
    init: function() {
        this.appendDummyInput()
            .appendField(new Blockly.FieldTextInput("text"), "TXT");
        this.setOutput(true, "String");
        this.setColour(310);  // You can set any other color code if you want
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

Blockly.Blocks['create_number_variable_custom'] = {
    init: function() {
        this.appendValueInput("VALUE")
            .setCheck("Number")
            .appendField("create NUMBER variable")
            .appendField(new Blockly.FieldTextInput("variableName"), "VAR_NAME")
            .appendField("with value");
        this.setColour(290);  
        this.setPreviousStatement(true, null);
        this.setNextStatement(true, null);
    },
    // Define the default shape for the block using mutations
    mutationToDom: function() {
        var container = document.createElement('mutation');
        container.setAttribute('has_number', 'true');
        return container;
    },
    // Apply the mutation to the block
    domToMutation: function(xmlElement) {
        var hasNumber = (xmlElement.getAttribute('has_number') === 'true');
        if (hasNumber) {
            this.appendNumber();
        }
    },
    // Append the 'number' block by default
    appendNumber: function() {
        var numberBlock = this.workspace.newBlock('number');
        numberBlock.initSvg();
        numberBlock.render();
        this.getInput('VALUE').connection.connect(numberBlock.outputConnection);
    }
};

Blockly.Blocks['create_string_variable_custom'] = {
    init: function() {
        this.appendValueInput("VALUE")
            .setCheck("String")
            .appendField("create STRING variable")
            .appendField(new Blockly.FieldTextInput("variableName"), "VAR_NAME")
            .appendField("with value");
        this.setColour(300);  
        this.setPreviousStatement(true, null);
        this.setNextStatement(true, null);
    },
    // Define the default shape for the block using mutations
    mutationToDom: function() {
        var container = document.createElement('mutation');
        container.setAttribute('has_string', 'true');
        return container;
    },
    // Apply the mutation to the block
    domToMutation: function(xmlElement) {
        var hasString = (xmlElement.getAttribute('has_string') === 'true');
        if (hasString) {
            this.appendString();
        }
    },
    // Append the 'string' block by default
    appendString: function() {
        var stringBlock = this.workspace.newBlock('string');
        stringBlock.initSvg();
        stringBlock.render();
        this.getInput('VALUE').connection.connect(stringBlock.outputConnection);
    }
};


Blockly.Blocks['create_string_variable'] = {
    init: function() {
        this.appendValueInput("VALUE")
            .setCheck("String")
            .appendField("create STRING variable")
            .appendField(new Blockly.FieldTextInput("variableName"), "VAR_NAME")
            .appendField("with value");
        this.setColour(300);  
        this.setPreviousStatement(true, null);
        this.setNextStatement(true, null);
    }
};


Blockly.Blocks['create_string_variable'] = {
    init: function() {
        this.appendValueInput("VALUE")
            .setCheck("String")
            .appendField("create STRING variable")
            .appendField(new Blockly.FieldVariable("variable"), "VAR_NAME")
            .appendField("with value");
        this.setColour(290);  // Adjust color as needed
        this.setPreviousStatement(true, null);
        this.setNextStatement(true, null);
    }
};

Blockly.Blocks['create_string_variable'] = {
    init: function() {
        this.appendValueInput("VALUE")
            .setCheck("String")
            .appendField("create STRING variable")
            .appendField(new Blockly.FieldVariable("variable"), "VAR_NAME")
            .appendField("with value");
        this.setColour(290);  // Adjust color as needed
        this.setPreviousStatement(true, null);
        this.setNextStatement(true, null);
    }
};

Blockly.JavaScript['check_ph'] = function (block) {
    var code = `check_ph`;
    return [code, Blockly.JavaScript.ORDER_ATOMIC];
};

Blockly.JavaScript['check_water_level'] = function (block) {
    return 'check_water_level\n';
};

Blockly.JavaScript['check_water_temperature'] = function (block) {
    var code = `check_water_temp`;
    return [code, Blockly.JavaScript.ORDER_ATOMIC];
};

Blockly.JavaScript['enable_relay'] = function (block) {
    var code = `enable_relay\n`;  // Using "\n" to ensure the next block (if any) starts on a new line
    return code;
};

Blockly.JavaScript['disable_relay'] = function (block) {
    var code = `disable_relay\n`;  // Using "\n" to ensure the next block (if any) starts on a new line
    return code;
};

Blockly.JavaScript['read_sensor'] = function (block) {
    return 'check_sensor\n';
};

Blockly.JavaScript['number'] = function (block) {
    var number = block.getFieldValue('NUM');
    return [number, Blockly.JavaScript.ORDER_ATOMIC];
};

Blockly.JavaScript['string'] = function(block) {
    var text = block.getFieldValue('TXT');
    // We need to wrap the string in quotes to make it a valid string in code.
    return ['"' + text + '"', Blockly.JavaScript.ORDER_ATOMIC];
};

Blockly.JavaScript['print'] = function (block) {
    var value_to_print = Blockly.JavaScript.valueToCode(block, 'PRINT', Blockly.JavaScript.ORDER_ATOMIC);

    var code = `
    print \"${value_to_print}\"\n`;

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
        ${value_value1} ${op} ${value_value2}
    `;

    return [code, Blockly.JavaScript.ORDER_FUNCTION_CALL];
};

Blockly.JavaScript['create_number_variable_custom'] = function(block) {
    var variable_name = block.getFieldValue('VAR_NAME');
    var value = Blockly.JavaScript.valueToCode(block, 'VALUE', Blockly.JavaScript.ORDER_ATOMIC);
    return 'num ' + variable_name + '(' + value + ')\n';
};

Blockly.JavaScript['create_string_variable_custom'] = function(block) {
    var variable_name = block.getFieldValue('VAR_NAME');
    var value = Blockly.JavaScript.valueToCode(block, 'VALUE', Blockly.JavaScript.ORDER_ATOMIC);
    return 'str ' + variable_name + '(' + value + ')\n';
};

