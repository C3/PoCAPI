var kafka = require('kafka-node');
var HighLevelProducer = kafka.HighLevelProducer;
var KeyedMessage = kafka.KeyedMessage;
var Client = kafka.Client;
var stringify = require('node-stringify');

var client = new Client('localhost:2181', 'customer-consumption-data', {
  sessionTimeout: 300,
  spinDelay: 100,
  retries: 2
});

// For this demo we just log client errors to the console.
client.on('error', function(error) {
  console.error(error);
});


// --------------- Kafka producer ------------------------- 

var producer = new HighLevelProducer(client);
var message= [{"long":-37.81253023	,"latt":144.9267054	,"pin":"vic3000","leak":80}];
	 
	
		producer.on('ready', function() {
			for(var msg of message)
			{
				produceMesg(stringify(msg));
				
			}
		});
	 
		
	
	
// For this demo we just log producer errors to the console.
producer.on('error', function(error) {
  console.error(error);
});

function produceMesg(msg)
{
console.log(msg);	
// Create a new payload
  var payload = [{
    topic: 'sew',
    messages: msg
  }];

  //Send payload to Kafka and log result/error
  producer.send(payload, function(error, result) {
    console.info('Sent payload to Kafka: ', payload);
    if (error) {
      console.error(error);
    } else {
      var formattedResult = result[0]
      console.log('result: ', result)
    }
  });


}
