import requests
import json

url = 'http://localhost:3000/executePseudocode'

# Sample pseudocode payload
data = {
    "pseudocode": [
        "SET humidity TO read_dht",
        "SET temp TO read_temp",
        "IF humidity < 40 AND temp > 28",
        "relay_on",
        "ELSE",
        "relay_off",
        "END_IF"
    ]
}



headers = {'Content-type': 'application/json'}

response = requests.post(url, data=json.dumps(data), headers=headers)  # Change GET to POST

if response.status_code == 200:
    print("Response:", response.text)  # Print the plain text response directly
else:
    print(f"Request failed with status code {response.status_code}: {response.text}")
