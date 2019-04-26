const mqtt = require('mqtt')
const client = mqtt.connect('mqtt://test.mosquitto.org')
client.on('connect', () => {
     client.subscribe('test/data',{qos:1})
})
client.on('message',function(topic,message){
console.log('this message :',message.toString());
//send the post request to laravel app
var sendDATA=message.toString();
var http=require('http');
var querystring = require('querystring');
const options = {
      hostname: '10.10.81.13',
      port: 80,
      path: '/api/test',
      method: 'POST',
      headers: {
         'Content-Type': 'application/x-www-form-urlencoded',       'Content-Length': Buffer.byteLength(sendDATA)
      }
};
const req = http.request(options, (res) => {
    console.log(`STATUS: ${res.statusCode}`);
    console.log(`HEADERS: ${JSON.stringify(res.headers)}`);
    res.setEncoding('utf8');
    res.on('data', (chunk) => {
       console.log(`BODY: ${chunk}`);
    });
    res.on('end', () => {
    console.log('No more data in response.');
    });
});
req.on('error', (e) => {
console.error(`problem with request: ${e.message}`);
});
req.write(sendDATA);
req.end();
});