var workspace = Blockly.inject('blocklyDiv', {
    toolbox: document.getElementById('toolbox')
});

function sendPostRequest(apiEndpoint) {
    return fetch(apiEndpoint, {
        method: 'POST'
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
    })
    .catch(error => {
        const outputDiv = document.getElementById("outputDiv");
        outputDiv.innerHTML += `${error.message}<br>`;
        throw error;
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
        // Wrap generated code inside an async IIFE
        var asyncCode = `(async () => {${generatedCode}})();`;

        // Evaluate (run) the generated code
        eval(asyncCode);
    } catch (error) {
        console.error('There was an error in the generated code:', error);
    }
});

window.onerror = function (msg, url, lineNo, columnNo, error) {
    const outputDiv = document.getElementById("outputDiv");
    outputDiv.innerHTML += `Error: ${msg} at line ${lineNo}, column ${columnNo}<br>`;
    return true;  // This will prevent the error from being shown in the console
};

document.getElementById('generateCode').addEventListener('click', function() {
    // Generate JavaScript code from Blockly workspace
    var generatedCode = Blockly.JavaScript.workspaceToCode(workspace);
    generatedCode = generatedCode.replace(/;\s*$/, '');  // This removes a semi-colon at the end of the code.
    // Display the generated code in the newOutputDiv
    document.getElementById("newOutputDiv").innerHTML = `<pre>${generatedCode}</pre>`;
});

function asyncYielder(genFunc) {
    const gen = genFunc();

    function handle(result) {
        if (result.done) return result.value;
        return Promise.resolve(result.value).then(
            res => handle(gen.next(res)),
            err => handle(gen.throw(err))
        );
    }

    return handle(gen.next());
}


document.addEventListener("DOMContentLoaded", function() {
    document.getElementById('saveCode').addEventListener('click', function() {
        let content = document.getElementById('newOutputDiv').textContent;
        let encodedUri = encodeURIComponent(content);
        let dataUri = 'data:text/plain;charset=utf-8,' + encodedUri;
        
        let link = document.createElement('a');
        link.setAttribute('href', dataUri);
        link.setAttribute('download', 'outputCode.js');
        document.body.appendChild(link);  // Required for Firefox
        
        link.click();  // This will download the text as an outputCode.txt file

        document.body.removeChild(link);  // Clean up after download
    });
});
