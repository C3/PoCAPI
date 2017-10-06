var app = require('express')();
var http = require('http').Server(app);
var path = require('path');
var io = require('socket.io')(http);
var kafka = require('kafka-node');
var stringify = require('node-stringify');
var HighLevelConsumer = kafka.HighLevelConsumer;
var Client = kafka.Client;
var sql = require('mssql/msnodesqlv8');
//DB config

  const config = {
    user: 'seqsqladmin',
    password: 'Pa$$w0rd098',
    server: 'sewsqlsrv01.database.windows.net', // You can use 'localhost\\instance' to connect to named instance
    database: 'sewsql01',
    options: {
        encrypt: true // Use this if you're on Windows Azure
    }
}


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

app.get('/getcustomerdetails/:meterId', function(req,res){
		sql.connect(config)
		.then(function() {
		 const request = new sql.Request();
		 var meterId = req.params.meterId;
		 request.input('prop_id', sql.VarChar(50), meterId);
				request.execute('dbo.SP_GET_SEW_CUSTOMER_DETAILS_BY_PROPID', (err, result) => {
					console.log(result.recordset); // 
					res.send(result.recordset);
					sql.close();
				});
		})
		.catch(function(err) {
		  console.log(err);
		});
});

app.get('/getbillingdetails/:custId', function(req,res){
		sql.connect(config)
		.then(function() {
		 const request = new sql.Request();
		 var custId = req.params.custId;
		 request.input('cust_id', sql.VarChar(50), custId);
				request.execute('dbo.SP_GET_SEW_BILLING_DETAILS_BY_USTID', (err, result) => {
					console.log(result.recordset); // 
					res.send(result.recordset);
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

var client = new Client('localhost:2181');
var topics = [{
  topic: 'sew'
}];

var options = {
  autoCommit: true,
  fetchMaxWaitMs: 1000,
  fetchMaxBytes: 1024 * 1024
};
var consumer = new HighLevelConsumer(client, topics, options);
io.on('connection', function(socket) {
consumer.on('message', function(message) {
  console.log(message);
  socket.emit('newMsg',message);
});
});

consumer.on('error', function(err) {
  console.log('error', err);
});



http.listen(3000, function() {
   console.log('listening on *:3000');
});
