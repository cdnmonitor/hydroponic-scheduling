// Check pH
Blockly.Blocks['check_ph'] = {
    init: function() {
        this.appendDummyInput()
            .appendField("Check pH Level");
        this.setOutput(true, "Number");
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
Blockly.JavaScript['check_ph'] = function(block) {
    return 'sendPostRequest("/api/checkPH");\n';
};

Blockly.JavaScript['check_water_level'] = function(block) {
    return 'sendPostRequest("/api/checkWaterLevel");\n';
};

Blockly.JavaScript['check_water_temperature'] = function(block) {
    return 'sendPostRequest("/api/checkWaterTemperature");\n';
};
