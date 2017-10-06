var app = require('express')();
var http = require('http').Server(app);
var path = require('path');
var io = require('socket.io')(http);

var stringify = require('node-stringify');

var Connection = require('tedious').Connection;
var Request = require('tedious').Request;

//DB config

  // Create connection to database
var config = 
   {
     userName: 'seqsqladmin', // update me
     password: 'Pa$$w0rd098', // update me
     server: 'sewsqlsrv01.database.windows.net', // update me
     options: 
        {
           database: 'sewsql01' //update me
           , encrypt: true
        }
   }
var connection = new Connection(config);

// Attempt to connect and execute queries if connection goes through


//twilio instance

const twilioclient = require('twilio')(
  "ACe273d87f37787c17ae1bc6deaf47c92d",
  "76fb3f4620c1f96abea399aa2ffcb63a"
);

//REST end points
app.get('/', function(req, res) {
   res.sendFile(path.join(__dirname + '/public/map.html'));
});

app.get('/healthicon/:leak', function(req,res){
var leak = req.params.leak;
	console.log("Leak Probability ::: " + leak);
	if(leak>50)
           res.sendFile(path.join(__dirname + '/public/images/red.png'));
	else
	   res.sendFile(path.join(__dirname + '/public/images/yellow.png'));
	
});

app.get('/js/:jsFile', function(req,res){
	var jsFile = req.params.jsFile;
	res.sendFile(path.join(__dirname + '/public/js/'+jsFile));
});

app.get('/getsewloc', function(req,res){
connection.on('connect', function(err) 
   {
     if (err) 
       {
          console.log(err)
       }
    else
       {
	    var query = "select distinct sdl.[Lattitude], sdl.[Longitude],  sct.[street_name] from dbo.sew_device_loc sdl, [dbo].[CRM_Data] crm where sdl.deviceData=crm.property_id";
        var result = queryDatabase(query);
		
		res.send(result);
       }
   }
 );
});

app.get('/sendsms/:mobileNumber', function(req,res){
var toMobileNumer = req.params.mobileNumber;
twilioclient.messages.create({
  from: "3213253112",
  to:toMobileNumer,
  body: "Hello world from Node JS SEW App"
}).then((messsage) => console.log(message.sid));
});

var EventHubClient = require('azure-event-hubs').Client;
 
var eventHubClient = EventHubClient.fromConnectionString('Endpoint=sb://sewehd001.servicebus.windows.net/;SharedAccessKeyName=RootManageSharedAccessKey;SharedAccessKey=T8RE+I9K0/ch7xBuZpCXpFCkbrb5Pdcm7llU7usicmM=', 'sew-meter-data')
eventHubClient.open()
    .then(function() {
        return eventHubClient.createReceiver('sew-leak-detection', '10', { startAfterTime: Date.now() })
    })
    .then(function (rx) {
        rx.on('errorReceived', function (err) { console.log(err); }); 
        rx.on('message', function (message) {
            var body = message.body;
            // See http://azure.github.io/amqpnetlite/articles/azure_sb_eventhubs.html for details on message annotation properties from EH. 
           // var enqueuedTime = Date.parse(message.systemProperties['x-opt-enqueued-time']);
			console.log(body);
			socket.emit('newMsg',body);
        });
    });

http.listen(3000, function() {
   console.log('listening on *:3000');
});

function queryDatabase(query)
{ 
	console.log('Reading rows from the Table...');

       // Read all rows from table
     request = new Request(
          query,
             function(err, rowCount, rows) 
                {
                    console.log(rows);
					return rows;
                    //process.exit();
                }
            );

     
     connection.execSql(request);
}
