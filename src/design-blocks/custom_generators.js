Blockly.JavaScript['enable_relay'] = function (block) {
    var code = `relay_on\n`;  // Using "\n" to ensure the next block (if any) starts on a new line
    return code;
};

Blockly.JavaScript['disable_relay'] = function (block) {
    var code = `relay_off\n`;  // Using "\n" to ensure the next block (if any) starts on a new line
    return code;
};

Blockly.JavaScript['read_dht'] = function (block) {
    var code = `DHT_humid`;
    return [code, Blockly.JavaScript.ORDER_ATOMIC];
};

Blockly.JavaScript['read_dht'] = function (block) {
    var code = `DHT_temp`;
    return [code, Blockly.JavaScript.ORDER_ATOMIC];
};

Blockly.JavaScript['read_temp'] = function (block) {
    var code = `read_temp`;
    return [code, Blockly.JavaScript.ORDER_ATOMIC];
};

Blockly.JavaScript['read_ph'] = function (block) {
    var code = `read_ph`;
    return [code, Blockly.JavaScript.ORDER_ATOMIC];
};

Blockly.JavaScript['number'] = function (block) {
    var number = block.getFieldValue('NUM');
    return [number, Blockly.JavaScript.ORDER_ATOMIC];
};

Blockly.JavaScript['custom_string'] = function(block) {
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
    var code = `${value_value1} ${op} ${value_value2}`;  // Adjusted this line

    return [code, Blockly.JavaScript.ORDER_ATOMIC];
};

Blockly.JavaScript['get_variable'] = function(block) {
    var variable_name = block.getFieldValue('VAR_NAME');
    var code = `${variable_name}`;  // Adjusted this line
    return [code, Blockly.JavaScript.ORDER_ATOMIC];
};


Blockly.JavaScript['set_variable'] = function(block) {
    var variable_name = block.getFieldValue('VAR_NAME');
    var value = Blockly.JavaScript.valueToCode(block, 'VALUE', Blockly.JavaScript.ORDER_ATOMIC);
    return 'SET ' + variable_name + ' TO ' + value + '\n';
};

Blockly.JavaScript['get_variable'] = function(block) {
    var variable_name = block.getFieldValue('VAR_NAME');
    var code = '' + variable_name + '';
    return [code, Blockly.JavaScript.ORDER_ATOMIC];
};

Blockly.JavaScript['custom_for_loop'] = function(block) {
    var variable_name = block.getFieldValue('VAR');
    var start_value = block.getFieldValue('START');
    var end_value = block.getFieldValue('END');
    var commands = Blockly.JavaScript.statementToCode(block, 'DO');
    
    var code = 'FOR ' + variable_name + ' ' + start_value + ' TO ' + end_value + '\n ' + commands.trim() + '\nEND_FOR\n';
    return code;
};

Blockly.JavaScript['custom_while'] = function(block) {
    var condition = Blockly.JavaScript.valueToCode(block, 'CONDITION', Blockly.JavaScript.ORDER_ATOMIC) || 'false';
    var statements_do = Blockly.JavaScript.statementToCode(block, 'DO');
    var code = 'WHILE ' + condition + '\n ' + statements_do.trim() + '\nEND_WHILE\n';
    return code;
};
