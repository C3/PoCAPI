'use strict';

var Client = require('azure-iothub').Client;
var Message = require('azure-iot-common').Message;

var connectionString = 'HostName=sewiothubpoc.azure-devices.net;SharedAccessKeyName=iothubowner;SharedAccessKey=zxfQB0und7Gt4YxqGc7ksoV/H5K2s+e82w/B36e9aj4=';
var targetDevice = 'Tag3';

var serviceClient = Client.fromConnectionString(connectionString);

function printResultFor(op) {
	  return function printResult(err, res) {
	    if (err) console.log(op + ' error: ' + err.toString());
	    if (res) console.log(op + ' status: ' + res.constructor.name);
	  };
	}

function receiveFeedback(err, receiver){
	  receiver.on('message', function (msg) {
	    console.log('Feedback message:')
	    console.log(msg.getData().toString('utf-8'));
	  });
	}

serviceClient.open(function (err) {
	  if (err) {
	    console.error('Could not connect: ' + err.message);
	  } else {
	    console.log('Service client connected');
	    serviceClient.getFeedbackReceiver(receiveFeedback);
	    var message = new Message('{"type": "write_once", "characteristic_uuid": "f000aa66-0451-4000-b000-000000000000", "data": "AA=="} ');
	    message.ack = 'full';
	    message.messageId = "MsgtoDevice";
	    console.log('Sending message: ' + message.getData());
	    serviceClient.send(targetDevice, message, printResultFor('send'));
	  }
	});