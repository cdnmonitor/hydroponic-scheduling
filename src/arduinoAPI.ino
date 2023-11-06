#include <WiFiS3.h>
#include <DHT.h>
#include "ph_iso_grav.h"
#include "ph_grav.h"
#include "rtd_grav.h"

#define WATER_LEVEL_PIN A2
#define DHT11PIN 4
#define DHTTYPE DHT11

const char *ssid = "SpectrumSetup-EF";
const char *password = "lightsnake383";

WiFiServer server(80);
DHT dht(DHT11PIN, DHTTYPE);

#ifdef USE_PULSE_OUT
Gravity_pH_Isolated pH(A0);
#else
Gravity_pH pH(A0);
#endif

Gravity_RTD RTD(A1);

char user_data[32];
uint8_t user_bytes_received = 0;

void setup() {
  Serial.begin(9600);
  dht.begin();
  connectToWiFi();
  pHSetup();
  rtdSetup();
  server.begin();
}

void connectToWiFi() {
  WiFi.begin(ssid, password);
  int attempts = 0;
  while (WiFi.status() != WL_CONNECTED) {
    delay(1000);
    Serial.println("Connecting to WiFi...");
    attempts++;
    if (attempts > 10) {
      Serial.println("Failed to connect to WiFi");
      // Handle WiFi connection failure here, e.g., retry or take appropriate action
      break;
    }
  }
  if (WiFi.status() == WL_CONNECTED) {
    Serial.println("Connected to WiFi");
  }
}

void pHSetup() {
  Serial.println(F("Use commands \"CAL,7\", \"CAL,4\", and \"CAL,10\" to calibrate the pH circuit"));
  Serial.println(F("Use \"CAL,CLEAR\" to clear the pH calibration");
  if (pH.begin()) Serial.println("Loaded EEPROM for pH");
}

void rtdSetup() {
  Serial.println(F("Use \"CAL,nnn.n\" to calibrate the RTD circuit. \"CAL,CLEAR\" clears the RTD calibration");
  if (RTD.begin()) Serial.println("Loaded EEPROM for RTD");
}

void getPublicIP(WiFiClient &client) {
  const char *server = "api.ipify.org";
  WiFiClient http;

  if (!http.connect(server, 80)) {
    sendResponse(client, 500, "Error connecting to server");
    return;
  }

  http.println("GET / HTTP/1.1");
  http.println("Host: api.ipify.org");
  http.println("Connection: close");
  http.println();

  while (http.connected() && http.readStringUntil('\n') != "\r") {}

  String publicIP = http.readStringUntil('\r');
  publicIP.trim();

  Serial.println("Public IP: " + publicIP);
  sendResponse(client, 200, publicIP);
  http.stop();
}

void parse_cmd(char *string) {
  String cmd = String(string);
  cmd.toUpperCase();
  handlePHCommands(cmd);
  handleRTDCommands(cmd);
}

void handlePHCommands(String &cmd) {
  if (cmd.startsWith("CAL,7")) {
    pH.cal_mid();
    Serial.println("MID CALIBRATED");
  } else if (cmd.startsWith("CAL,4")) {
    pH.cal_low();
    Serial.println("LOW CALIBRATED");
  } else if (cmd.startsWith("CAL,10")) {
    pH.cal_high();
    Serial.println("HIGH CALIBRATED");
  } else if (cmd.startsWith("CAL,CLEAR")) {
    pH.cal_clear();
    Serial.println("CALIBRATION CLEARED");
  } else {
    // Handle unrecognized pH command
    Serial.println("Invalid pH command: " + cmd);
  }
}

void handleRTDCommands(String &cmd) {
  if (cmd.startsWith("CAL")) {
    int index = cmd.indexOf(',');
    if (index != -1) {
      String param = cmd.substring(index + 1);
      if (param.equals("CLEAR")) {
        RTD.cal_clear();
        Serial.println("CALIBRATION CLEARED");
      } else if (param.toFloat() > 0.0) {
        RTD.cal(param.toFloat());
        Serial.println("RTD CALIBRATED");
      } else {
        // Handle invalid RTD calibration command
        Serial.println("Invalid RTD calibration command: " + cmd);
      }
    }
  }
}

void sendResponse(WiFiClient &client, int statusCode, const String &response) {
  client.println("HTTP/1.1 " + String(statusCode));
  client.println("Content-Type: text/plain");
  client.println();
  client.println(response);
}

void loop() {
  WiFiClient client = server.available();
  if (client) {
    handleClientRequest(client);
    client.stop();
    Serial.println("Client disconnected");
  }

  if (Serial.available()) {
    user_bytes_received = Serial.readBytesUntil('\n', user_data, sizeof(user_data));
    if (user_bytes_received) {
      parse_cmd(user_data);
      user_bytes_received = 0;
      memset(user_data, 0, sizeof(user_data));
    }
  }
}

void handleClientRequest(WiFiClient &client) {
  String request = client.readStringUntil('\r');
  client.flush();

  if (request.length() == 0) {
    // Handle empty or invalid request
    sendResponse(client, 400, "Bad Request");
    return;
  }

  if (request.indexOf("HTTP/1.1") == -1) {
    // Handle unsupported HTTP version
    sendResponse(client, 505, "HTTP Version Not Supported");
    return;
  }

  if (request.indexOf("/LED_ON") != -1) {
    digitalWrite(LED_BUILTIN, HIGH);
    sendResponse(client, 200, "LED is on");
  } else if (request.indexOf("/LED_OFF") != -1) {
    digitalWrite(LED_BUILTIN, LOW);
    sendResponse(client, 200, "LED is off");
  } else if (request.indexOf("/read_ph") != -1) {
    float ph_value = pH.read_ph();
    sendResponse(client, 200, String(ph_value, 2));
  } else if (request.indexOf("/read_temp") != -1) {
    float temp_value = RTD.read_RTD_temp_C();
    if (temp_value != -127.0) {
      sendResponse(client, 200, String(temp_value, 2));
    } else {
      // Handle RTD sensor reading error
      sendResponse(client, 500, "RTD Sensor Reading Error");
    }
  } else if (request.indexOf("/get_public_IP") != -1) {
    getPublicIP(client);
  } else if (request.indexOf("/read_DHT") != -1) {
    float humidity = dht.readHumidity();
    float temperature = dht.readTemperature();

    if (!isnan(humidity) && !isnan(temperature)) {
      sendResponse(client, 200, String(temperature, 2) + "," + String(humidity, 2));
    } else {
      // Handle DHT sensor reading error
      sendResponse(client, 500, "DHT Sensor Reading Error");
    }
  } else if (request.indexOf("/get_water_level") != -1) {
    int water_level = analogRead(WATER_LEVEL_PIN);
    sendResponse(client, 200, String(water_level));
  } else {
    sendResponse(client, 404, "Invalid request");
  }
}
