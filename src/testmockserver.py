import requests

base_url = 'http://localhost:80'  # Assuming your mock server runs on port 80

endpoints = [
    '/relay_on',
    '/relay_off',
    '/temperature',
    '/humidity',
    '/probeTemperature',
    '/ph'
]

for endpoint in endpoints:
    # Using POST requests as defined in the mock server
    response = requests.post(base_url + endpoint)

    if response.status_code == 200:
        print(f"Testing {endpoint}:")
        print(f"Response: {response.text}\n")
    else:
        print(f"Request to {endpoint} failed with status code {response.status_code}: {response.text}\n")
