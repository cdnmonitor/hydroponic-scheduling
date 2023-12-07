import requests
import json

def send_pseudocode(data):
    url = 'http://localhost:3000/executePseudocode'
    headers = {'Content-type': 'application/json'}
    response = requests.post(url, data=json.dumps(data), headers=headers)

    if response.status_code == 200:
        response_data = response.json()
        print("Response:")
        print(json.dumps(response_data, indent=4))
    else:
        print(f"Request failed with status code {response.status_code}: {response.text}")

def main():
    pseudocode_scenarios = {
        "1": {
            "description": "Simple Action Execution",
            "pseudocode": ["relay_on", "DHT_temp", "DHT_humid"]
        },
        "2": {
            "description": "Variable Assignment and Conditional Logic",
            "pseudocode": ["SET temp TO DHT_temp", "IF temp < 25", "relay_on", "END_IF"]
        },
        "3": {
            "description": "Loop with Condition",
            "pseudocode": [
                "SET counter TO 0",
                "FOR i 1 TO 3",
                "SET counter TO counter + 1",
                "END_FOR"
    ]
        },
        "4": {
            "description": "Complex Conditional Logic",
            "pseudocode": [
                "SET temp TO DHT_temp",
                "SET humid TO DHT_humid",
                "IF temp > 20 AND humid < 50",
                "relay_on",
                "ELSE",
                "relay_off",
                "END_IF"
            ]
        },
        # Add more scenarios as needed
    }

    while True:
        print("\nSelect a pseudocode scenario to test:")
        for key, scenario in pseudocode_scenarios.items():
            print(f"{key}: {scenario['description']}")
        print("0: Exit")

        choice = input("Enter your choice: ")
        if choice == "0":
            break
        elif choice in pseudocode_scenarios:
            print(f"\nExecuting scenario: {pseudocode_scenarios[choice]['description']}")
            send_pseudocode({"pseudocode": pseudocode_scenarios[choice]["pseudocode"]})
        else:
            print("Invalid choice. Please try again.")

if __name__ == "__main__":
    main()
