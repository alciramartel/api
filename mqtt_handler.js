const mqtt = require('mqtt');

class MqttHandler {
    constructor() {
        this.mqttClient = null;
        // this.host = 'mqtt://10.10.10.35';
        this.host = 'http://test.mosquitto.org';
        this.username = '';
        this.password = '';
    }

    connect() {
        //Conexión con MQTT con credenciales.
        this.mqttClient = mqtt.connect(this.host);

        //Mqtt error calback
        this.mqttClient.on('error', (err) => {
            console.log(err);
            this.mqttClient.end();
        });

        //Mqtt connection callback
        this.mqttClient.on('connect', () => {
            //console.log(this.mqttClient);
            console.log('mqtt client connected');
            var options = { qos: 1 };
            var datetime = new Date();
            this.mqttClient.publish('test/data', 'data');
        });

        //Mqtt subscriptions
        this.mqttClient.subscribe('test/data', { qos: 1 });

        //Writte console when message arrive
        this.mqttClient.on('message', function (topic, message) {
            //console.log(topic);
            console.log(message.toString());
            var sendDATA = message.toString();
            var http = require('http');
            var querystring = require('querystring');
            //const postData=sendDATA;
            const postData = sendDATA;

            const options = {
                hostname: 'projet.test',
                port: 80,
                path: '/api/test',
                method: 'POST',
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                    'Content-Length': Buffer.byteLength(postData)
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

            // write data to request body
            req.write(postData);
            req.end();
        });

        this.mqttClient.on('close', () => {
            console.log('mqtt client disconnected');
        });
    }

    sendMessage(message) {
        console.log(message.toString());
        this.mqttClient.publish('test/data', message);
    }
}

module.exports = MqttHandler;