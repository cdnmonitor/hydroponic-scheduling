#include "WiFiS3.h"
#include "DHT.h"

char ssid[] = "SpectrumSetup-EF";        // your network SSID (name)
char pass[] = "lightsnake383";        // your network password
int status = WL_IDLE_STATUS;
WiFiServer server(80);


#define DHTPIN 2     // Pin which is connected to the DHT sensor
#define DHTTYPE DHT11   // DHT 11
#define RELAY_PIN 13  // Relay control pin


DHT dht(DHTPIN, DHTTYPE);


void setup() {
  Serial.begin(9600);
    pinMode(RELAY_PIN, OUTPUT);
  if (WiFi.status() == WL_NO_MODULE) {
    Serial.println("Communication with WiFi module failed!");
    while (true);
  }

  String fv = WiFi.firmwareVersion();
  if (fv < WIFI_FIRMWARE_LATEST_VERSION) {
    Serial.println("Please upgrade the firmware");
  }

  while (status != WL_CONNECTED) {
    Serial.print("Attempting to connect to Network named: ");
    Serial.println(ssid);
    status = WiFi.begin(ssid, pass);
    if (status != WL_CONNECTED) {
      Serial.println(millis() + "ms: Failed to connect, retrying...");
      delay(5000);
    }
  }
  server.begin();
  dht.begin();
  printWifiStatus();
}

void loop() {
  WiFiClient client = server.available();
  if (!client) {
    return;
  }
  Serial.println(String(millis()) + "ms: New client connected");

  String requestLine = "";
  while (client.connected()) {
    if (client.available()) {
      char c = client.read();
      Serial.write(c);
      if (c == '\n') {
        if (requestLine.endsWith("\r")) {
          requestLine.remove(requestLine.length() - 1);
        }
        if (requestLine.length() > 0) {
          Serial.println(String(millis()) + "ms: Request Line: " + requestLine);
          processRequest(requestLine, client);
          break;
        }
        requestLine = "";
      } else {
        requestLine += c;
      }
    }
  }
  client.stop();
  Serial.println(String(millis()) + "ms: Client disconnected");
}

void processRequest(String request, WiFiClient &client) {
  Serial.println(String(millis()) + "ms: Processing Request");

  client.println("HTTP/1.1 200 OK");
  client.println("Content-type: text/plain");
  client.println("Connection: close");
  client.println();

  if (request.startsWith("POST /humidity")) {
    String humidityResponse = readHumidity();
    client.println(humidityResponse);
  } else if (request.startsWith("POST /temperature")) {
    String temperatureResponse = readTemperature();
    client.println(temperatureResponse);
  } else if (request.startsWith("POST /relay_on")) {
    Serial.println(String(millis()) + "ms: Relay ON endpoint hit");
    controlRelay(true);
    client.println("{\"response\":\"Relay turned on\"}");
  } else if (request.startsWith("POST /relay_off")) {
    Serial.println(String(millis()) + "ms: Relay OFF endpoint hit");
    controlRelay(false);
    client.println("{\"response\":\"Relay turned off\"}");
  } else {
    client.println("{\"error\":\"Unsupported request method.\"}");
  }

  client.println();
  Serial.println(String(millis()) + "ms: Response sent");
}



void printWifiStatus() {
  Serial.print("SSID: ");
  Serial.println(WiFi.SSID());
  IPAddress ip = WiFi.localIP();
  Serial.print("IP Address: ");
  Serial.println(ip);
  long rssi = WiFi.RSSI();
  Serial.print("Signal strength (RSSI):");
  Serial.print(rssi);
  Serial.println(" dBm");
  Serial.print("Open a browser to http://");
  Serial.println(ip);
}

String readHumidity() {
  float h = dht.readHumidity();
  if (isnan(h)) {
    return "{\"error\":\"Failed to read from DHT sensor\"}";
  } else {
    return "{\"response\":\"" + String(h) + "\"}";
  }
}

String readTemperature() {
  float t = dht.readTemperature();
  if (isnan(t)) {
    return "{\"error\":\"Failed to read from DHT sensor\"}";
  } else {
    float calibratedTemp = t - 1.3; // Adjust this value based on your observations
    return "{\"response\":\"" + String(calibratedTemp) + "\"}";
  }
}

void controlRelay(bool turnOn) {
  Serial.println(String(millis()) + "ms: Relay control function called. Turn on: " + (turnOn ? "Yes" : "No"));
  if (turnOn) {
    digitalWrite(RELAY_PIN, HIGH);
    Serial.println(String(millis()) + "ms: Relay should be ON now");
  } else {
    digitalWrite(RELAY_PIN, LOW);
    Serial.println(String(millis()) + "ms: Relay should be OFF now");
  }
}

