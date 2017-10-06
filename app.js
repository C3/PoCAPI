var app = require('express')();
var http = require('http').Server(app);
var path = require('path');
var io = require('socket.io')(http);
var stringify = require('node-stringify');

//DB config
var sql = require('node-sqlserver');

var conn_str = "Server=tcp:sewsqlsrv01.database.windows.net,1433;"+
				"Initial Catalog=sewsql01;"+
				"Security Info=False;"+
				"User ID=seqsqladmin;"+
				"Password=Pa$$w0rd098;"+
				"MultipleActiveResultSets=False;"+
				"Encrypt=True;"+
				"TrustServerCertificate=False;"+
				"Connection Timeout=30";


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
	var sewLocQry = "select distinct sdl.[Lattitude], sdl.[Longitude], sct.[street_name] from dbo.sew_device_loc sdl, [dbo].[CRM_Data] crm where sdl.deviceData=crm.property_id";
		    res.writeHead(200, { 'Content-Type': 'text/plain' });
    sql.open(conn_str, function (err, conn) {
        if (err) {
            res.end("Error opening the connection!");
            return;
        }
        conn.queryRaw(sewLocQry, function (err, results) {
            if (err) {
                res.write("Error running query!");
                return;
            }
            console.log("row count = " + results.rows.length + "\n");
            res.send(results);
        }); 
    });
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

var port = normalizePort(process.env.PORT || '3000');
http.listen(port, function() {
   console.log('listening on *:'+port);
});

function normalizePort(val) {
                var port = parseInt(val, 10);

                if (isNaN(port)) {
                  // named pipe
                  return val;
                }

                if (port >= 0) {
                  // port number
                  return port;
                }

                return false;
              }

