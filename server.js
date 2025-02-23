const aedes = require('aedes')();
const net = require('net');
const http = require('http');
const ws = require('websocket-stream');

const mqttPort = 1883;   // TCP için MQTT portu
const httpPort = 3000;   // HTTP/WebSocket için port

// TCP Üzerinden MQTT Broker
const tcpServer = net.createServer(aedes.handle);
tcpServer.listen(mqttPort, () => {
  console.log(`MQTT broker TCP portunda çalışıyor: ${mqttPort}`);
});

// HTTP Sunucusu (WebSocket için)
const httpServer = http.createServer((req, res) => {
  res.writeHead(200, { 'Content-Type': 'text/plain' });
  res.end('MQTT WebSocket Broker çalışıyor!');
});

httpServer.listen(httpPort, () => {
  console.log(`HTTP/WebSocket sunucusu ${httpPort} portunda çalışıyor`);
});

// WebSocket üzerinden MQTT desteği
ws.createServer({ server: httpServer }, aedes.handle);

// İstemci bağlantılarını dinleme
aedes.on('client', (client) => {
  console.log('Client bağlandı:', client.id);
});

aedes.on('clientDisconnect', (client) => {
  console.log('Client bağlantıyı kesti:', client.id);
});

// Mesaj yayınlandığında loglama
aedes.on('publish', (packet, client) => {
  // Sistem mesajlarını hariç tutmak için (isteğe bağlı)
  if (packet.topic.indexOf('$SYS') === -1) {
    console.log('Mesaj yayınlandı - Konu:', packet.topic, 'Mesaj:', packet.payload.toString());
  }
});
