var app = require('express')();
var http = require('http').Server(app);
var path = require('path');
var io = require('socket.io')(http);

var stringify = require('node-stringify');

//DB config


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
		sql.connect(config)
		.then(function() {
		 const request = new sql.Request()
				request.execute('dbo.SP_GET_SEW_LOC', (err, result) => {
					console.log(result.recordset); // 
					res.send(result.recordset);
					sql.close();
				});
		})
		.catch(function(err) {
		  console.log(err);
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

