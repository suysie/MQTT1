var mqtt = require('mqtt')
var client  = mqtt.connect('mqtt://test.mosquitto.org')

var Gpio = require('onoff').Gpio;
var led = new Gpio(21, 'out');
var GPIO4= new Gpio(17, 'in', 'both');
client.on('connect', function () {
  client.subscribe('presence', function (err) {
    if (!err) {
      client.publish('presence', 'stan zijn pi is online')
    }
  })
})

client.on('message',function(topic, message, packet){
  if(message.toString() == "SET_OUTPUT")
  {
    if(led.readSync() == 1){
      led.writeSync(0);
        console.log("relais aan via mqtt");
    }
    else if(led.readSync() == 0){
      led.writeSync(1);
      console.log("relais uit via mqtt");
    }
  }
});


GPIO4.watch(function(err, value) {
     console.log(value);
     if(value == 1){
         client.publish('presence', 'the pin is high')
     }
     if(value == 0){
        client.publish('presence', 'the pin is low')
    }
});