
Blockly.JavaScript['check_ph'] = function (block) {
    var code = `check_ph`;
    return [code, Blockly.JavaScript.ORDER_ATOMIC];
};

Blockly.JavaScript['check_water_level'] = function (block) {
    var code = `check_water_level`;
    return [code, Blockly.JavaScript.ORDER_ATOMIC];
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
    var code = `check_sensor`;
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

Blockly.JavaScript['set_number_variable'] = function(block) {
    var variable_name = block.getFieldValue('VAR_NAME');
    var value = Blockly.JavaScript.valueToCode(block, 'VALUE', Blockly.JavaScript.ORDER_ATOMIC);
    return variable_name + ' = ' + value + ';\n';
};

Blockly.JavaScript['set_string_variable'] = function(block) {
    var variable_name = block.getFieldValue('VAR_NAME');
    var value = Blockly.JavaScript.valueToCode(block, 'VALUE', Blockly.JavaScript.ORDER_ATOMIC);
    return variable_name + ' = ' + value + ';\n';
};

Blockly.JavaScript['get_string_variable'] = function(block) {
    var variable_name = block.getFieldValue('VAR_NAME');
    return [variable_name, Blockly.JavaScript.ORDER_ATOMIC];
};

Blockly.JavaScript['get_number_variable'] = function(block) {
    var variable_name = block.getFieldValue('VAR_NAME');
    return [variable_name, Blockly.JavaScript.ORDER_ATOMIC];
};

Blockly.JavaScript['for_loop_custom'] = function(block) {
    var variable_from = block.getFieldValue('VAR_FROM');
    var variable_to = block.getFieldValue('VAR_TO');
    
    var loopContent = Blockly.JavaScript.statementToCode(block, 'DO');
    
    var code = 'for ' + variable_from + ' to ' + variable_to + ' {\n' +
               loopContent + 
               '}\n';
    return code;
};


Blockly.JavaScript['append_strings'] = function(block) {
    let values = [Blockly.JavaScript.valueToCode(block, 'STRING1', Blockly.JavaScript.ORDER_ATOMIC),
                  Blockly.JavaScript.valueToCode(block, 'STRING2', Blockly.JavaScript.ORDER_ATOMIC)];
    for (let i = 3; i <= block.itemCount_ + 2; i++) {
        values.push(Blockly.JavaScript.valueToCode(block, 'STRING' + i, Blockly.JavaScript.ORDER_ATOMIC));
    }
    return [values.join(' + '), Blockly.JavaScript.ORDER_ATOMIC];
};
