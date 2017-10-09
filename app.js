var app = require('express')();
var http = require('http').Server(app);
var path = require('path');
var io = require('socket.io')(http);
var stringify = require('node-stringify');
const sql = require('mssql'); 
//DB config connecting to the remote server
const dbconfig =    {
     user: 'seqsqladmin', // update me
     password: 'Pa$$w0rd098', // update me
     server: 'sewsqlsrv01.database.windows.net', // update me
	 database: 'sewsql01',
     options: 
        {
            //update me
           encrypt: true
        }
   };


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
		sql.connect(dbconfig)
		.then(function() {
		 const request = new sql.Request()
				request.query('select distinct sdl.[Lattitude],sdl.[Longitude], sct.[street_name] from sewsql01.sew_device_loc sdl, [dbo].[CRM_Data] crm where sdl.deviceData=crm.property_id', (err, result) => {
				if(err)
					console.log(err);
					else{
					console.log(result.recordset); // 
					res.send(result.recordset);
					}
					sql.close();
				});
				
				
		})
		.catch(function(err) {
		  console.log(err);
		});
});

app.get('/getcustomerdetails/:meterId', function(req,res){
		sql.connect(dbconfig)
		.then(function() {
		 const request = new sql.Request();
		 var meterId = req.params.meterId;
		 request.input('prop_id', sql.VarChar(50), meterId);
				request.execute('dbo.SP_GET_SEW_CUSTOMER_DETAILS_BY_PROPID', (err, result) => {
					if(!err){
					console.log(result.recordset); // 
					res.send(result.recordset);
					}
					sql.close();
				});
		})
		.catch(function(err) {
		  console.log(err);
		});
});

app.get('/getbillingdetails/:custId', function(req,res){
		sql.connect(dbconfig)
		.then(function() {
		 const request = new sql.Request();
		 var custId = req.params.custId;
		 request.input('cust_id', sql.VarChar(50), custId);
				request.execute('dbo.SP_GET_SEW_BILLING_DETAILS_BY_USTID', (err, result) => {
				if(!err){
					console.log(result.recordset); // 
					res.send(result.recordset);
					}
					sql.close();
				});
		})
		.catch(function(err) {
		  console.log(err);
		});
});


app.get('/sendsms/:mobileNumber', function(req,res){
var toMobileNumer = req.params.mobileNumber;
twilioclient.messages.create({
  from: "3213253112",
  to:toMobileNumer,
  body: "Hello world from Node JS SEW App"
}).then((messsage) => console.log(message.sid));
});

//SOCKET IO on

io.on('connection', function(socket) {
	console.log('user disconnected');
	socket.on('disconnect', function(){
		console.log('user disconnected');
		  socket.removeAllListeners('disconnect');
		  io.removeAllListeners('connection');
	  });
});
var EventHubClient = require('azure-event-hubs').Client;
var eventHubClient = EventHubClient.fromConnectionString('Endpoint=sb://sewehd001.servicebus.windows.net/;SharedAccessKeyName=RootManageSharedAccessKey;SharedAccessKey=T8RE+I9K0/ch7xBuZpCXpFCkbrb5Pdcm7llU7usicmM=', 'sew-meter-data')

	eventHubClient.open()
    .then(function() {
        return eventHubClient.createReceiver('sew-leak-detection', '0', { startAfterTime: Date.now() })
    })
    .then(function (rx) {
        rx.on('errorReceived', function (err) { console.log(err); }); 
        rx.on('message', function (message) {
            var body = message.body;
			console.log(body);
			io.sockets.emit('newMsg',body);
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

