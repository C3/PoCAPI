var app = require('express')();
var http = require('http').Server(app);
var path = require('path');
var io = require('socket.io')(http);
var stringify = require('node-stringify');
const sql = require('mssql');
//DB config
const dbconfig = {
    user: 'seqsqladmin',
    password: 'Pa$$w0rd098',
    server: 'sewsqlsrv01.database.windows.net', // You can use 'localhost\\instance' to connect to named instance
    database: 'sewsql01',
    options: {
        encrypt: true // Use this if you're on Windows Azure
    }
}


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

