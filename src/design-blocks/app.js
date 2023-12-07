var workspace = Blockly.inject('blocklyDiv', {
    toolbox: document.getElementById('toolbox')
});

document.getElementById('executeCode').addEventListener('click', function () {
    // Generate JavaScript code from Blockly workspace
    var generatedCode = generateAndProcessCode();

    // Format the code for the server
    var pseudocodeLines = generatedCode.split('\n'); // Assuming each line of code is a new line in the generated code

    // Prepare the data to send
    var dataToSend = JSON.stringify({ pseudocode: pseudocodeLines });

    var userEndpointInputTxt = document.getElementById("userEndpointInput").value
    // URL of your server endpoint
    var serverUrl = `http://${userEndpointInputTxt}/executePseudocode`;

    // Send the pseudocode to the server
    fetch(serverUrl, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: dataToSend
    })
        .then(response => response.json())
        .then(data => {
            // Handle the response from the server
            console.log('Success:', data);
            document.getElementById("newOutputDiv").innerHTML += "Pseudocode sent successfully.";
        })
        .catch((error) => {
            console.error('Error:', error);
            document.getElementById("newOutputDiv").innerHTML += "Error executing pseudocode: " + error;
        });

    document.getElementById("newOutputDiv").innerHTML = `<pre>Sending: ${dataToSend} to ${serverUrl}</pre>`;
});

// Function to generate and process the code
function generateAndProcessCode() {
    var generatedCode = Blockly.JavaScript.workspaceToCode(workspace);
    generatedCode = generatedCode.replace(/;\s*$/gm, '');

    if (typeof generatedCode !== 'string') {
        generatedCode = String(generatedCode);
    }

    // Capitalize 'if' and 'else'
    generatedCode = generatedCode.replace(/if/g, 'IF');
    generatedCode = generatedCode.replace(/else/g, 'ELSE');

    // Remove parentheses
    generatedCode = generatedCode.replace(/\(/g, '');
    generatedCode = generatedCode.replace(/\)/g, '');

    // Remove curly brackets
    generatedCode = generatedCode.replace(/\{/g, '');
    generatedCode = generatedCode.replace(/\}/g, '');

    generatedCode = addEndIfStatements(generatedCode);

    generatedCode = removeEmptyLines(generatedCode);

    return generatedCode;
}

// Event listener for the button click
document.getElementById('generateCode').addEventListener('click', function () {
    var processedCode = generateAndProcessCode();
    document.getElementById("newOutputDiv").innerHTML = `<pre>${processedCode}</pre>`;
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

document.addEventListener("DOMContentLoaded", function () {
    document.getElementById('saveCode').addEventListener('click', function () {
        let content = generateAndProcessCode();
        let encodedUri = encodeURIComponent(content);
        let dataUri = 'data:text/plain;charset=utf-8,' + encodedUri;

        let link = document.createElement('a');
        link.setAttribute('href', dataUri);
        link.setAttribute('download', 'outputCode.txt');
        document.body.appendChild(link);  // Required for Firefox

        link.click();  // This will download the text as an outputCode.txt file

        document.body.removeChild(link);  // Clean up after download
    });
});
function addEndIfStatements(code) {
    const lines = code.split('\n');
    const endIfStack = []; // Stack to keep track of 'IF' line indentations
    const result = [];

    lines.forEach((line, index) => {
        const currentIndent = countIndentation(line);
        const trimmedLine = line.trim();

        if (trimmedLine.startsWith('IF')) {
            endIfStack.push(currentIndent); // Push current indentation level to stack
            result.push(line);
        } else {
            while (endIfStack.length > 0 && currentIndent <= endIfStack[endIfStack.length - 1]) {
                result.push(generateEndIfLine(endIfStack.pop())); // Add 'END_IF' for each level we're exiting
            }
            result.push(line);
        }
    });

    // Close any remaining 'IF' blocks
    while (endIfStack.length > 0) {
        result.push(generateEndIfLine(endIfStack.pop()));
    }

    return result.join('\n');
}

function countIndentation(line) {
    const match = line.match(/^(\s*)/); // Match leading whitespace
    return match ? match[1].length : 0; // Return length of whitespace
}

function generateEndIfLine(indentLevel) {
    return ' '.repeat(indentLevel) + 'END_IF'; // Generate 'END_IF' line with appropriate indentation
}

function removeEmptyLines(text) {
    return text.split('\n')
        .filter(line => line.trim() !== '') // Filter out lines that are empty or contain only whitespace
        .join('\n');
}