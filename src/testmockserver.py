import requests

base_url = 'http://localhost:8080'

endpoints = [
    '/relay_on',
    '/relay_off',
    '/DHT_temp',
    '/DHT_humid',
    '/read_temp',
    '/read_ph'
]

for endpoint in endpoints:
    response = requests.get(base_url + endpoint)

    if response.status_code == 200:
        print(f"Testing {endpoint}:")
        print(f"Response: {response.text}\n")
    else:
        print(f"Request to {endpoint} failed with status code {response.status_code}: {response.text}\n")
