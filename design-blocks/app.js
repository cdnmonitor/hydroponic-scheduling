var workspace = Blockly.inject('blocklyDiv', {
    toolbox: document.getElementById('toolbox')
});

function sendPostRequest(apiEndpoint) {
    fetch(apiEndpoint, {
        method: 'POST'
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        return response.json();
    })
    .then(data => console.log(data))
    .catch(error => {
        const outputDiv = document.getElementById("outputDiv");
        outputDiv.innerHTML += `Error: ${error.message}<br>`;
    });    
}

function printToOutput(value) {
    var outputDiv = document.getElementById("outputDiv");
    var currentContent = outputDiv.innerHTML;
    outputDiv.innerHTML = currentContent + value + "<br/>";
}

document.getElementById('runCode').addEventListener('click', function() {
    // Generate JavaScript code from Blockly workspace
    var generatedCode = Blockly.JavaScript.workspaceToCode(workspace);
    document.getElementById("outputDiv").innerHTML = "";
    try {
        // Evaluate (run) the generated code
        eval(generatedCode);
    } catch (error) {
        console.error('There was an error in the generated code:', error);
    }
});

window.onerror = function (msg, url, lineNo, columnNo, error) {
    const outputDiv = document.getElementById("outputDiv");
    outputDiv.innerHTML += `Error: ${msg} at line ${lineNo}, column ${columnNo}<br>`;
    return true;  // This will prevent the error from being shown in the console
};
