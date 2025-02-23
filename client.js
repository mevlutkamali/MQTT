const mqtt = require('mqtt');
const brokerUrl = 'mqtt://127.0.0.1:1883';
const client = mqtt.connect(brokerUrl);

client.on('connect', function() {
  console.log('MQTT broker’a başarıyla bağlanıldı!');

  // 'new-user' konusuna abone ol ve mesaj gönder
  client.subscribe('new-user', function(err) {
    if (!err) {
      const newUserMessage = 'Mevlüt-' + Math.ceil(Math.random() * 10);
      client.publish('new-user', newUserMessage);
      console.log(`'new-user' konusuna mesaj gönderildi: ${newUserMessage}`);
    }
  });

  // 'led' konusuna abone ol ve mesaj gönder
  client.subscribe('led', function(err) {
    if (!err) {
      client.publish('led', 'on');
      console.log(`'led' konusuna mesaj gönderildi: on`);
    }
  });
});

client.on('message', function(topic, message) {
  console.log(`Gelen Mesaj - Konu: ${topic} : ${message.toString()}`);
});
