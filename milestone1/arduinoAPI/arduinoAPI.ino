#include <WiFiS3.h>
#include <dht11.h>
#include "ph_iso_grav.h"       
#include "ph_grav.h"             
#include "rtd_grav.h"

#define DHT11PIN 4
dht11 DHT11;

#ifdef USE_PULSE_OUT
  Gravity_pH_Isolated pH = Gravity_pH_Isolated(A0);         
#else
  Gravity_pH pH = Gravity_pH(A0);   
#endif

Gravity_RTD RTD = Gravity_RTD(A1);

uint8_t user_bytes_received = 0;                
const uint8_t bufferlen = 32;                   
char user_data[bufferlen];                     

const char* ssid = "SpectrumSetup-EF";
const char* password = "secretfoobarpassword";

WiFiServer server(80);

void setup() {
  Serial.begin(9600);
  
  WiFi.begin(ssid, password);
  while (WiFi.status() != WL_CONNECTED) {
    delay(1000);
    Serial.println("Connecting to WiFi...");
  }
  Serial.println("Connected to WiFi");
  
  Serial.println(F("Use commands \"CAL,7\", \"CAL,4\", and \"CAL,10\" to calibrate the pH circuit to those respective values"));
  Serial.println(F("Use command \"CAL,CLEAR\" to clear the pH calibration"));
  Serial.println(F("Use command \"CAL,nnn.n\" to calibrate the RTD circuit to a specific temperature\n\"CAL,CLEAR\" clears the RTD calibration"));
  
  if(pH.begin()){
    Serial.println("Loaded EEPROM for pH");
  }
  if(RTD.begin()){
    Serial.println("Loaded EEPROM for RTD");
  }

  server.begin();
}

void getPublicIP(WiFiClient client) {
  WiFiClient http;
  const char* server = "api.ipify.org";

  if (http.connect(server, 80)) {
    http.println("GET / HTTP/1.1");
    http.println("Host: api.ipify.org");
    http.println("Connection: close");
    http.println();

    while (http.connected()) {
      String line = http.readStringUntil('\n');
      if (line == "\r") {
        break;
      }
    }

    String publicIP = http.readStringUntil('\r');
    publicIP.trim();  

    Serial.println("Public IP: " + publicIP);
    
    client.println("HTTP/1.1 200 OK");
    client.println("Content-Type: text/plain");
    client.println();
    client.println(publicIP);
  } else {
    Serial.println("Error connecting to server");
    client.println("HTTP/1.1 500 Internal Server Error");
    client.println("Content-Type: text/plain");
    client.println();
    client.println("Error connecting to server");
  }

  http.stop();
}

void parse_cmd(char* string) {
  String cmd = String(string);
  cmd.toUpperCase(); 
  
  if (cmd.startsWith("CAL,7")) {       
    pH.cal_mid();                                
    Serial.println("MID CALIBRATED");
  }
  else if (cmd.startsWith("CAL,4")) {            
    pH.cal_low();                                
    Serial.println("LOW CALIBRATED");
  }
  else if (cmd.startsWith("CAL,10")) {      
    pH.cal_high();                               
    Serial.println("HIGH CALIBRATED");
  }
  else if (cmd.startsWith("CAL,CLEAR")) { 
    pH.cal_clear();                              
    Serial.println("CALIBRATION CLEARED");
  }
  
  if(cmd.startsWith("CAL")){
    int index = cmd.indexOf(',');
    if(index != -1){
      String param = cmd.substring(index+1, cmd.length());
      if(param.equals("CLEAR")){
        RTD.cal_clear();
        Serial.println("CALIBRATION CLEARED");
      }else {
        RTD.cal(param.toFloat());
        Serial.println("RTD CALIBRATED");
      }
    }
  }
}

void loop() {
  WiFiClient client = server.available();
  if (client) {
    String request = client.readStringUntil('\r');
    client.flush();
    
    if (request.indexOf("/LED_ON") != -1) {
      digitalWrite(LED_BUILTIN, HIGH);
      client.println("HTTP/1.1 200 OK");
      client.println("Content-Type: text/plain");
      client.println();
      client.println("LED is on");
    } 
    else if (request.indexOf("/LED_OFF") != -1) {
      digitalWrite(LED_BUILTIN, LOW);
      client.println("HTTP/1.1 200 OK");
      client.println("Content-Type: text/plain");
      client.println();
      client.println("LED is off");
    } 
    else if (request.indexOf("/read_ph") != -1) {
      float ph_value = pH.read_ph();
      client.println("HTTP/1.1 200 OK");
      client.println("Content-Type: text/plain");
      client.println();
      client.println(ph_value, 2);  // Send pH value only
    }
    else if (request.indexOf("/read_temp") != -1) {
      float temp_value = RTD.read_RTD_temp_C();
      client.println("HTTP/1.1 200 OK");
      client.println("Content-Type: text/plain");
      client.println();
      client.println(temp_value, 2);  // Send temperature value only
    }
    else if (request.indexOf("/get_public_IP") != -1){
      getPublicIP(client);
    }
    else if (request.indexOf("/read_DHT") != -1) {
      int chk = DHT11.read(DHT11PIN);
      if (chk == DHTLIB_OK) {
        client.println("HTTP/1.1 200 OK");
        client.println("Content-Type: text/plain");
        client.println();
        client.print((float)DHT11.temperature, 2);  // Send temperature value only
        client.print(",");
        client.println((float)DHT11.humidity, 2);  // Send humidity value only
      }
    }
    else {
      client.println("HTTP/1.1 404 Not Found");
      client.println("Content-Type: text/plain");
      client.println();
      client.println("Invalid request");
    }
    
    client.stop();
    Serial.println("Client disconnected");
  }
  
  if (Serial.available() > 0) {                                                      
    user_bytes_received = Serial.readBytesUntil(13, user_data, sizeof(user_data));   
  }

  if (user_bytes_received) {
    parse_cmd(user_data);
    user_bytes_received = 0;                                                        
    memset(user_data, 0, sizeof(user_data));                                         
  }
}
