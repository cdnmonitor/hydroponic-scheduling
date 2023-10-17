Blockly.Blocks['check_ph'] = {
    init: function () {
        this.appendDummyInput()
            .appendField("Check pH Level");
        this.setOutput(true, "Number"); // This block outputs a value of type "Number"
        this.setColour(60);
    }
};

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

Blockly.Blocks['custom_string'] = {
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

Blockly.Blocks['set_number_variable'] = {
    init: function() {
        this.appendValueInput("VALUE")
            .setCheck("Number")
            .appendField("set NUMBER variable")
            .appendField(new Blockly.FieldTextInput("variableName"), "VAR_NAME")
            .appendField("to value");
        this.setColour(290);  
        this.setPreviousStatement(true, null);
        this.setNextStatement(true, null);
    }
};

Blockly.Blocks['set_string_variable'] = {
    init: function() {
        this.appendValueInput("VALUE")
            .setCheck("String")
            .appendField("set STRING variable")
            .appendField(new Blockly.FieldTextInput("variableName"), "VAR_NAME")
            .appendField("to value");
        this.setColour(300);  
        this.setPreviousStatement(true, null);
        this.setNextStatement(true, null);
    }
};

Blockly.Blocks['get_string_variable'] = {
    init: function() {
        this.appendDummyInput()
            .appendField("get STRING variable")
            .appendField(new Blockly.FieldTextInput("variableName"), "VAR_NAME");
        this.setColour(300);
        this.setOutput(true, "String");
    }
};

Blockly.Blocks['get_number_variable'] = {
    init: function() {
        this.appendDummyInput()
            .appendField("get NUMBER variable")
            .appendField(new Blockly.FieldTextInput("variableName"), "VAR_NAME");
        this.setColour(290);
        this.setOutput(true, "Number");
    }
};
Blockly.Blocks['for_loop_custom'] = {
    init: function() {
        this.appendDummyInput()
            .appendField("for")
            .appendField(new Blockly.FieldTextInput("variableName1"), "VAR_FROM")
            .appendField("to")
            .appendField(new Blockly.FieldTextInput("variableName2"), "VAR_TO");
            
        this.appendStatementInput("DO")
            .appendField("do");

        this.setColour(120);  
        this.setPreviousStatement(true, null);
        this.setNextStatement(true, null);
    }
};


Blockly.Blocks['append_strings'] = {
    init: function() {
        this.appendValueInput("STRING1")
            .setCheck("String")
            .appendField("append");
        this.appendValueInput("STRING2")
            .setCheck("String")
            .appendField("with");
        this.setColour(310);
        this.setOutput(true, "String");
    }
};
