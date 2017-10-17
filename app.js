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
   res.sendFile(path.join(__dirname + '/public/map1.html'));
});

//REST end points
app.get('/devices', function(req, res) {
	sql.connect(dbconfig)
	.then(function() {
	 const request = new sql.Request()
	 request.query('select * from dbo.propertyData prop, [dbo].[CRM_Data] crm where prop.eventTime=(select max(prop2.eventTime) from dbo.propertyData prop2 where prop.deviceId = prop2.deviceId) and prop.deviceId= crm.property_id ', (err, result) => {
			if(err)
				console.log(err);
			else {
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


app.get('/healthicon/:leak', function(req,res){
var leak = req.params.leak;
	console.log("Leak Probability ::: " + leak);
	if(leak!="null")
	{
           res.sendFile(path.join(__dirname + '/public/images/red.png'));
	}
	else
	{
	   res.sendFile(path.join(__dirname + '/public/images/yellow.png'));
	}
});

app.get('/filtericon/', function(req,res){

	   res.sendFile(path.join(__dirname + '/public/images/blue.png'));
});

app.get('/js/:jsFile', function(req,res){
	var jsFile = req.params.jsFile;
	res.sendFile(path.join(__dirname + '/public/js/'+jsFile));
});

app.get('/images/:imgFile', function(req,res){
	var imgFile = req.params.imgFile;
	res.sendFile(path.join(__dirname + '/public/images/'+imgFile));
});

app.get('/getsewloc', function(req,res){
		sql.connect(dbconfig)
		.then(function() {
		 const request = new sql.Request()
				request.execute('[dbo].[SP_GET_SEW_LOC]', (err, result) => {
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

app.get('/maintenanceHistory/:deviceId', function(req, res) {
	sql.connect(dbconfig)
	.then(function() {
	 const request = new sql.Request()
	 var deviceId = req.params.deviceId;
	 console.log("Osama Test = " + deviceId);
	 request.query('SELECT Top 10 deviceId, dateTime,customerId,COALESCE(NULLIF(leakReason,\'null\'), \' \') As leakReason,maintenanceStatus,maintananceSupervisorID,maintenanceSuperVisor,COALESCE(NULLIF(note,\'null\'), \' \') As note FROM dbo.Maintenance_details$ md WHERE md.deviceId = \'' + deviceId + '\'  order by dateTime desc', (err, result) => {
			if(err)
				console.log(err);
			else {
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

const twilioclient = require('twilio')(
  "AC401d9a1f0bb9ff980b455d68426fc25e", 
  "859a5122522f260d556eff34fda60213" 
);

app.get('/sendsms/:address', function(req,res){
//console.log("Tested");	
	try {			
			var customerMobile = '+61420539737';
			var technicianMobile = '+61450612035';
			var msgCustomer = "Hi, we apologies for the service disruption.  The ETA for restoration is within 2 hours.  We’ll provide an update when available.";
			var msgTechnician = "There’s an immediate outage located at " + req.params.address +  " Please proceed to site as next job";
			sendalert(customerMobile, msgCustomer,function(response){				
				//res.json(response);				
			})

			sendalert(technicianMobile, msgTechnician,function(response){				
				//res.json(response);				
			})
	
	} catch (err) {
		createErrorResponse(err, res);
	}

});

function sendalert(mobNumber,msg,callback) {	
	
		var response = {};
				
		twilioclient.messages.create({
			body: msg,
			to: mobNumber, // Text this number
		   from: '+18444580349' // From a valid Twilio number
		},function(err, data) {		
			
			if(err){				
				console.log(err);				
				response.status = "Failed";
				response.message = err.message;	
				response.statusCode = err.status;				
			} else {				
				response.status = "Success";					
				response.From = data.from;
				response.To = data.to;
				//response.message = data.body;				
				console.log(data);							
			}		
			 console.log(response);
			 callback(response);			
			 return;
			
		});		
}

function createErrorResponse(err, res) {
	
	var errorMessage = err.message == undefined ? err : err.message;
	var response = {
		"status" : "Error",
		"message" : errorMessage
	};
	if (Object.prototype.hasOwnProperty.call(err, "code")) {
		if (err.code == 401) {
			res.status(401);
			response.message = "Unauthorized: Access is denied due to invalid credentials.";
		} else if (err.code == 404) {
			response.message = "Requested data cannot be found.";
		}
	}
	//logger.errorLog(response.message);
	console.log(response.message)
	res.json(response);
}

//SOCKET IO on

io.on('connection', function(socket) {
	
	socket.on('disconnect', function(){
		console.log('user disconnected');
		  socket.removeAllListeners('disconnect');
		  io.removeAllListeners('connection');
	  });
});
var EventHubClient = require('azure-event-hubs').Client;
var eventHubClient = EventHubClient.fromConnectionString('Endpoint=sb://sewehd001.servicebus.windows.net/;SharedAccessKeyName=RootManageSharedAccessKey;SharedAccessKey=T8RE+I9K0/ch7xBuZpCXpFCkbrb5Pdcm7llU7usicmM=', 'sew-meter-data')

	eventHubClient.open()
    .then(eventHubClient.getPartitionIds.bind(eventHubClient))
    .then(function (partitionIds) {
        return partitionIds.map(function (partitionId) {
            return eventHubClient.createReceiver('$Default', partitionId, { 'startAfterTime': Date.now() }).then(function (receiver) {
		receiver.on('errorReceived', function (err) { console.log(err); });
                receiver.on('message', function (message) {
                	var jStrObj = String.fromCharCode.apply(null, message.body);
                	var jStr = jStrObj.split('\n');
                    //console.log(TextDecoder("utf-8").decode(message.body));
                	jStr.forEach(function(entry) {
                		//entry = entry + "}";
                	try {	
                	    console.log(entry);
                		io.sockets.emit('newMsg',JSON.parse(entry));
                	}
                	catch (e)
                	{
                		console.log(e);
                	}
                	});
                	
                	                	
                });
            });
        });
    })  


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

