/*var workspace = Blockly.inject('blocklyDiv', {
    toolbox: document.getElementById('toolbox')
});
*/
if (typeof defaultBlocks === 'undefined') {
    console.error('defaultBlocks is not defined. Please check your defaultBlocks.js file.');
} else {
    // Initialize Blockly workspace
    var workspace = Blockly.inject('blocklyDiv', {
        toolbox: document.getElementById('toolbox')
    });

    // Convert the XML string to a DOM element
    var parser = new DOMParser();
    var defaultBlocksDom = parser.parseFromString(defaultBlocks, "text/xml").documentElement;

    // Load default blocks into workspace
    Blockly.Xml.domToWorkspace(defaultBlocksDom, workspace);
}

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
        var xmlText = workspaceToXml(workspace);

    // The rest of your code for saving the XML text
    console.log(xmlText);
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

function workspaceToXml(workspace) {
    var xmlDom = Blockly.Xml.workspaceToDom(workspace);
    var xmlText = Blockly.Xml.domToPrettyText(xmlDom);
    return xmlText;
}

/*
var xmlString = '<xml xmlns="https://developers.google.com/blockly/xml">  <block type="set_variable" id="~WQ67k6b6gyF{|{OE$de" x="187" y="79">    <mutation xmlns="http://www.w3.org/1999/xhtml" has_number="true"></mutation>    <field name="VAR_NAME">variable_name</field>    <value name="VALUE">      <block type="number" id="NVcE4HL-p~Qo~/3g|%,u">        <field name="NUM"></field>      </block>    </value>    <next>      <block type="custom_for_loop" id="=7mdPY[(cAaviMlAr7FY">        <field name="VAR">i</field>        <field name="START">variable1</field>        <field name="END">variable2</field>      </block>    </next>  </block></xml>';
var parser = new DOMParser();
var xmlDoc = parser.parseFromString(xmlString, "text/xml");
var serializer = new XMLSerializer();
window.defaultBlocks = serializer.serializeToString(xmlDoc);

document.addEventListener("DOMContentLoaded", function () {
    var workspace = Blockly.inject('blocklyDiv', {
        toolbox: document.getElementById('toolbox')
    });

    var xmlString = '<xml xmlns="https://developers.google.com/blockly/xml">  <block type="set_variable" id="~WQ67k6b6gyF{|{OE$de" x="187" y="79">    <mutation xmlns="http://www.w3.org/1999/xhtml" has_number="true"></mutation>    <field name="VAR_NAME">variable_name</field>    <value name="VALUE">      <block type="number" id="NVcE4HL-p~Qo~/3g|%,u">        <field name="NUM"></field>      </block>    </value>    <next>      <block type="custom_for_loop" id="=7mdPY[(cAaviMlAr7FY">        <field name="VAR">i</field>        <field name="START">variable1</field>        <field name="END">variable2</field>      </block>    </next>  </block></xml>';
    var parser = new DOMParser();
    var xmlDoc = parser.parseFromString(xmlString, "text/xml");

    // Load the blocks into the Blockly workspace
    Blockly.Xml.domToWorkspace(xmlDoc, workspace);
});
*/