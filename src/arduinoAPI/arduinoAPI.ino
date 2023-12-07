#include "WiFiS3.h"
#include "DHT.h"

char ssid[] = "test";        // your network SSID (name)
char pass[] = "poopy11!!";        // your network password
int status = WL_IDLE_STATUS;
WiFiServer server(80);

#ifdef USE_PULSE_OUT
  #include "ph_iso_grav.h"       
  Gravity_pH_Isolated pH = Gravity_pH_Isolated(A0);         
#else
  #include "ph_grav.h"             
  Gravity_pH pH = Gravity_pH(A0);// A0 PH Pin

#include "rtd_grav.h"
Gravity_RTD RTD = Gravity_RTD(A1);

#endif
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
  if (pH.begin()) {                                     
    Serial.println("pH sensor initialized");
  }
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
  } else if (request.startsWith("POST /probeTemperature")) {
    String probeTemperatureResponse = probeTemperature();
    client.println(probeTemperatureResponse);
  } else if (request.startsWith("POST /relay_on")) {
    Serial.println(String(millis()) + "ms: Relay ON endpoint hit");
    controlRelay(true);
    client.println("{\"response\":\"Relay turned on\"}");
  } else if (request.startsWith("POST /relay_off")) {
    Serial.println(String(millis()) + "ms: Relay OFF endpoint hit");
    controlRelay(false);
    client.println("{\"response\":\"Relay turned off\"}");
  } else if (request.startsWith("POST /ph")) {
    String phResponse = readPH();
    client.println(phResponse);
  } else if (request.startsWith("POST /calibrate/ph/7")) {
    calibratePH(7);
    client.println("{\"response\":\"pH mid-point calibration done\"}");
  } else if (request.startsWith("POST /calibrate/ph/4")) {
    calibratePH(4);
    client.println("{\"response\":\"pH low-point calibration done\"}");
  } else if (request.startsWith("POST /calibrate/ph/10")) {
    calibratePH(10);
    client.println("{\"response\":\"pH high-point calibration done\"}");
  } else if (request.startsWith("POST /calibrate/ph/clear")) {
    calibratePH(0);
    client.println("{\"response\":\"pH calibration cleared\"}");
  } else if (request.startsWith("POST /temperature")) {
  String temperatureResponse = probeTemperature();
  client.println(temperatureResponse);
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

String readPH() {
  float phValue = pH.read_ph();
  return "{\"response\":\"" + String(phValue, 2) + "\"}"; // Adjust precision as needed
}

void calibratePH(int type) {
  switch (type) {
    case 7:
      pH.cal_mid();
      Serial.println("pH mid-point calibrated");
      break;
    case 4:
      pH.cal_low();
      Serial.println("pH low-point calibrated");
      break;
    case 10:
      pH.cal_high();
      Serial.println("pH high-point calibrated");
      break;
    case 0: // clear calibration
      pH.cal_clear();
      Serial.println("pH calibration cleared");
      break;
    default:
      Serial.println("Invalid pH calibration command");
      break;
  }
}

String probeTemperature() {
  float temperature = RTD.read_RTD_temp_F(); // or RTD.read_RTD_temp_C() for C
  return "{\"response\": " + String(temperature, 2) + "}";
}

