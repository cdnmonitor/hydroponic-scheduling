

Blockly.Blocks['check_ph'] = {
    init: function() {
        this.appendDummyInput()
            .appendField("Check pH Level");
        this.setNextStatement(true);  // Allows blocks to be placed after this one.
        this.setPreviousStatement(true);  // Allows blocks to be placed before this one.
        this.setColour(60);
    }
};

// Check Water Level
Blockly.Blocks['check_water_level'] = {
    init: function() {
        this.appendDummyInput()
            .appendField("Check Water Level");
        this.setOutput(true, "Number");
        this.setColour(90);
    }
};

// Check Water Temperature
Blockly.Blocks['check_water_temperature'] = {
    init: function() {
        this.appendDummyInput()
            .appendField("Check Water Temperature");
        this.setOutput(true, "Number");
        this.setColour(120);
    }
};

Blockly.Blocks['enable_relay'] = {
    init: function() {
        this.appendDummyInput()
            .appendField("Enable Relay");
        this.setPreviousStatement(true, null);
        this.setNextStatement(true, null);
        this.setColour(150);
    }
};

Blockly.Blocks['disable_relay'] = {
    init: function() {
        this.appendDummyInput()
            .appendField("Disable Relay");
        this.setPreviousStatement(true, null);
        this.setNextStatement(true, null);
        this.setColour(180);
    }
};

Blockly.Blocks['read_sensor'] = {
    init: function() {
        this.appendDummyInput()
            .appendField("Read Sensor");
        this.setOutput(true, "Number");
        this.setColour(210);
    }
};

Blockly.Blocks['number'] = {
    init: function() {
        this.appendDummyInput()
            .appendField(new Blockly.FieldTextInput("0", this.validateNumber), "NUM");
        this.setOutput(true, "Number");
        this.setColour(240);
    },
    validateNumber: function(number) {
        // Ensure that the input is a valid number.
        // If not, return null to reject the change.
        return (isNaN(number) ? null : String(number));
    }
};

Blockly.Blocks['print'] = {
    init: function() {
        this.appendValueInput("PRINT")
            .setCheck(null)
            .appendField("print");
        this.setPreviousStatement(true, null);
        this.setNextStatement(true, null);
        this.setColour(260);
    }
};

Blockly.JavaScript['check_ph'] = function(block) {
    var apiEndpoint = "http://23.243.138.154/read_ph";
    
    var code = `await sendPostRequest("${apiEndpoint}");\n`; // The \n ensures sequential blocks are on new lines.
    return code;
};

Blockly.JavaScript['check_water_level'] = function(block) {
    return 'sendPostRequest("/api/checkWaterLevel");\n';
};

Blockly.JavaScript['check_water_temperature'] = function(block) {
    var apiEndpoint = "http://23.243.138.154/read _temp";
    
    var code = `await sendPostRequest("${apiEndpoint}");\n`; // The \n ensures sequential blocks are on new lines.
    return code;
};

Blockly.JavaScript['enable_relay'] = function(block) {
    return 'sendPostRequest("/api/enableRelay");\n';
};

Blockly.JavaScript['disable_relay'] = function(block) {
    return 'sendPostRequest("/api/disableRelay");\n';
};

Blockly.JavaScript['read_sensor'] = function(block) {
    return 'sendPostRequest("/api/readSensor");\n';
};

Blockly.JavaScript['number'] = function(block) {
    var number = block.getFieldValue('NUM');
    return [number, Blockly.JavaScript.ORDER_ATOMIC];
};

Blockly.JavaScript['print'] = function(block) {
    var value_to_print = Blockly.JavaScript.valueToCode(block, 'PRINT', Blockly.JavaScript.ORDER_ATOMIC);
    return 'printToOutput(' + value_to_print + ');\n';
};
