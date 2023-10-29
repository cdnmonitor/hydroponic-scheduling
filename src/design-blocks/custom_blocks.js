Blockly.Blocks['enable_relay'] = {
    init: function () {
        this.appendDummyInput()
            .appendField("Enable Relay");
        this.setPreviousStatement(true, null);  // This block does not return a value, but it can connect to blocks before...
        this.setNextStatement(true, null);     // ...and after it
        this.setColour(180);  // Adjust color as needed
    }
};

Blockly.Blocks['disable_relay'] = {
    init: function () {
        this.appendDummyInput()
            .appendField("Disable Relay");
        this.setPreviousStatement(true, null);  // This block does not return a value, but it can connect to blocks before...
        this.setNextStatement(true, null);     // ...and after it
        this.setColour(180);  // Adjust color as needed
    }
};

Blockly.Blocks['read_dht'] = {
    init: function () {
        this.appendDummyInput()
            .appendField("Read DHT");
        this.setOutput(true, "Number");  // This block outputs a value of type "Number"
        this.setColour(60);  // Adjust color as needed
    }
};

Blockly.Blocks['read_temp'] = {
    init: function () {
        this.appendDummyInput()
            .appendField("Read Temperature");
        this.setOutput(true, "Number");  // This block outputs a value of type "Number"
        this.setColour(60);  // Adjust color as needed
    }
};

Blockly.Blocks['read_ph'] = {
    init: function () {
        this.appendDummyInput()
            .appendField("Check pH Level");
        this.setOutput(true, "Number");  // This block outputs a value of type "Number"
        this.setColour(60);  // Adjust color as needed
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

Blockly.Blocks['set_variable'] = {
    init: function() {
        this.appendValueInput("VALUE")
            .setCheck("Number")
            .appendField("set variable")
            .appendField(new Blockly.FieldTextInput("variable_name"), "VAR_NAME")
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

Blockly.Blocks['get_variable'] = {
    init: function() {
        this.appendDummyInput()
            .appendField("get variable")
            .appendField(new Blockly.FieldTextInput("variable_name"), "VAR_NAME");
        this.setColour(290);
        this.setOutput(true, "Number");
    }
};
Blockly.Blocks['custom_for_loop'] = {
    init: function() {
      this.appendDummyInput()
          .appendField("for")
          .appendField(new Blockly.FieldTextInput("i"), "VAR")
          .appendField("from")
          .appendField(new Blockly.FieldTextInput("variable1"), "START")
          .appendField("to")
           .appendField(new Blockly.FieldTextInput("variable2"), "END");
      this.appendStatementInput("DO")
          .setCheck(null)
          .appendField("");
      this.appendDummyInput()
      this.setPreviousStatement(true, null);
      this.setNextStatement(true, null);
      this.setColour(120);
      this.setTooltip("Custom For Loop");
      this.setHelpUrl("");
    }
  };

Blockly.Blocks['custom_while'] = {
    init: function() {
      this.appendValueInput("CONDITION")
          .setCheck("Boolean")
          .appendField("while");
      this.appendStatementInput("DO")
          .appendField("do");
      this.setPreviousStatement(true, null);
      this.setNextStatement(true, null);
      this.setColour(120);
      this.setTooltip("Custom while loop.");
      this.setHelpUrl("");
    }
  };
  