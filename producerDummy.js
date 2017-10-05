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
var message= [{"long":-37.80866507    ,"latt":144.9180365,"pin":"vic3004","leak":10, "deviceid":"8ffd4228-9582-4020-93a1-2b505db30a60"},
{"long":-37.80981786	,"latt":144.9298811	,"pin":"vic3000","leak":10, "deviceid":"5a2de673-8c3e-47a2-a0a6-f469909ba6f4"},
{"long":-37.8			,"latt":144.9286366	,"pin":"vic3000","leak":10, "deviceid":"f0bb4f81-7491-4563-b4d3-bb97ad660903"},
{"long":-37.81673421	,"latt":144.917264	,"pin":"vic3000","leak":10, "deviceid":"34ea7f0e-2daa-47c9-813c-dbb453dce5f6"},
{"long":-37.80866507	,"latt":144.9180365	,"pin":"vic3000","leak":10, "deviceid":"fc8d7a06-af55-4fd1-9ad7-c894650bb2a8"},
{"long":-37.81090282	,"latt":144.9192381	,"pin":"vic3000","leak":10, "deviceid":"f4b86a96-36dd-4919-afa6-6781ed6f434f"},
{"long":-37.81100453	,"latt":144.9186373	,"pin":"vic3000","leak":10, "deviceid":"ed7563c8-cf33-4e5b-88a9-712a4a63a7b4"},
{"long":-37.81158091	,"latt":144.9190235	,"pin":"vic3000","leak":10, "deviceid":"d0577086-0f38-4033-8796-5be90fbee8f3"},
{"long":-37.81253023	,"latt":144.9267054	,"pin":"vic3000","leak":10, "deviceid":"ad99a816-26ef-4802-a5cc-511d5da54f84"},
{"long":-37.81154701	,"latt":144.9279928	,"pin":"vic3000","leak":10, "deviceid":"df49adb4-11a7-43f5-8aea-b805418bf789"},
{"long":-37.80988567	,"latt":144.9278212	,"pin":"vic3000","leak":10, "deviceid":"a69ecaa2-1d37-4b51-b20f-e1754014bb68"},
{"long":-37.81015691	,"latt":144.928894	,"pin":"vic3000","leak":10, "deviceid":"1186bb96-dc54-46a4-a8ac-96dad67c1bc6"},
{"long":-37.81063158	,"latt":144.9290228	,"pin":"vic3000","leak":10, "deviceid":"07ffcc6a-a4f7-4c66-be30-270288fbce97"},
{"long":-37.81100453	,"latt":144.9290228	,"pin":"vic3000","leak":10, "deviceid":"695791f5-a645-4982-9eb0-4555ee0a986a"},
{"long":-37.81164872	,"latt":144.9291086	,"pin":"vic3000","leak":10, "deviceid":"c39f4cbe-747b-4b34-859d-74e7738c4a1d"},
{"long":-37.81036034	,"latt":144.9253321	,"pin":"vic3000","leak":10, "deviceid":"bb87c458-50e6-4708-b11f-3d6d1a471f7d"},
{"long":-37.81039425	,"latt":144.9246454	,"pin":"vic3000","leak":10, "deviceid":"4168c1f9-727c-48dd-aec8-7f314b502fa6"},
{"long":-37.81395418	,"latt":144.9200535	,"pin":"vic3000","leak":10, "deviceid":"6beada82-d565-49af-98be-6af2363d0cb8"},
{"long":-37.81297098	,"latt":144.9225855	,"pin":"vic3000","leak":10, "deviceid":"8779c549-b84e-4ab7-a34c-78f5bc921198"},
{"long":-37.81364905	,"latt":144.9227142	,"pin":"vic3000","leak":10, "deviceid":"a4b75fc7-d092-4b73-89fe-80b60551d1bc"},
{"long":-37.81154701	,"latt":144.9220276	,"pin":"vic3000","leak":10, "deviceid":"92be13bb-9312-4321-b618-5c496400ca6a"},
{"long":-37.81093672	,"latt":144.9232292	,"pin":"vic3000","leak":10, "deviceid":"edce3e75-0c8f-4691-8508-bc96bd08219e"},
{"long":-37.81425931	,"latt":144.9221992	,"pin":"vic3000","leak":10, "deviceid":"09aafa81-f2bf-4d2d-8b9b-124dea90549a"},
{"long":-37.80981786	,"latt":144.9298811	,"pin":"vic3004","leak":10, "deviceid":"25867403-02ce-4d6c-8c4d-41bebf856f75"},
{"long":-37.8			,"latt":144.9286366	,"pin":"vic3004","leak":10, "deviceid":"10b0c2e6-ff5c-4ab4-8872-035f3207e291"},
{"long":-37.81673421	,"latt":144.917264	,"pin":"vic3004","leak":10, "deviceid":"18701862-1233-46a8-8d42-4789d205a422"},
{"long":-37.81337783	,"latt":144.9327135	,"pin":"vic3004","leak":10, "deviceid":"b0d1983b-d9dc-4c39-ae06-abf57a9d3ca7"},
{"long":-37.8152764		,"latt":144.932456	,"pin":"vic3004","leak":10, "deviceid":"c57731b2-19a2-4a0e-847b-32a2f1ee025d"},
{"long":-37.80981786	,"latt":144.9361897	,"pin":"vic3004","leak":10, "deviceid":"027b32f1-e078-4e4a-ac23-62761466c400"},
{"long":-37.8108011		,"latt":144.9373055	,"pin":"vic3004","leak":10, "deviceid":"cfc34b42-184d-4fb7-8df1-00cc3a343d80"},
{"long":-37.81259804	,"latt":144.9358463	,"pin":"vic3004","leak":10, "deviceid":"147c1c7f-4e9d-44cc-8bb4-073b78b89f75"},
{"long":-37.81341173	,"latt":144.962494	,"pin":"vic3004","leak":10, "deviceid":"e651918a-70b4-4d2b-82db-c22792e1c9ec"},
{"long":-37.818781		,"latt":144.9362755	,"pin":"vic3004","leak":10, "deviceid":"ce3dbfab-8c4a-489e-b90c-96e1b7a491c6"},
{"long":-37.81466615	,"latt":144.9353743	,"pin":"vic3004","leak":10, "deviceid":"9007e689-b4bc-4e65-bbce-670f3d6a18a4"},
{"long":-37.81466615	,"latt":144.9365759	,"pin":"vic3004","leak":10, "deviceid":"a7cb53c1-0a89-430f-84e9-22722479fdf6"},
{"long":-37.81537811	,"latt":144.9345589	,"pin":"vic3004","leak":10, "deviceid":"54b764cf-7315-44f5-8ce3-6089e3d34990"},
{"long":-37.81385247	,"latt":144.938035	,"pin":"vic3004","leak":10, "deviceid":"59fc83ae-4a7d-434e-9505-ae5c9a49309c"},
{"long":-37.8094449		,"latt":144.9383354	,"pin":"vic3004","leak":10, "deviceid":"8da36fb1-0519-4b95-8b0f-80fd733f2051"},
{"long":-37.81063158	,"latt":144.9388504	,"pin":"vic3004","leak":10, "deviceid":"af641822-41f6-4bf6-8d85-6d892a9a0ccf"},
{"long":-37.81168262	,"latt":144.9393654	,"pin":"vic3004","leak":10, "deviceid":"001b5f8c-0fef-4b37-967f-031e7f5502e6"},
{"long":-37.8131744		,"latt":144.9400949	,"pin":"vic3004","leak":10, "deviceid":"2c72100d-e8b0-4d71-948a-33a1762189e1"},
{"long":-37.80869898	,"latt":144.9400949	,"pin":"vic3004","leak":10, "deviceid":"94d4bd70-63cd-48e4-8cad-66e06f97cef5"},
{"long":-37.81019082	,"latt":144.9408245	,"pin":"vic3004","leak":10, "deviceid":"2c051c94-e157-4d2f-a3a4-8916dd27700b"},
{"long":-37.8108011		,"latt":144.9411678	,"pin":"vic3004","leak":10, "deviceid":"00985a01-65f8-4f16-9ba4-6aebbce2cf26"},
{"long":-37.80795305	,"latt":144.9420261	,"pin":"vic3004","leak":10, "deviceid":"ec56c9d1-b89c-4dc3-af9e-1f884086bd59"}];
	
		

	
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
