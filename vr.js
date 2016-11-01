var fs = require('fs');
var express = require('express');
var app = express();

var online = {};

// Document Index
app.get('/',function(req,res){
	fs.readFile(__dirname+'/html/app.html','utf8',function(err,data){
		res.setHeader('Content-Type','text/html');
		res.send(data);
	});
});

// Stylesheets
app.get('/css/app.css',function(req,res){
	fs.readFile(__dirname+'/css/app.css','utf8',function(err,data){
		res.setHeader('Content-Type','text/css');
		res.send(data);
	});
});

// JavaScripts
app.get('/js/three.js',function(req,res){
	fs.readFile(__dirname+'/js/three.js','utf8',function(err,data){
		res.setHeader('Content-Type','application/javascript');
		res.send(data);
	});
});
app.get('/js/app.js',function(req,res){
	fs.readFile(__dirname+'/js/app.js','utf8',function(err,data){
		res.setHeader('Content-Type','application/javascript');
		res.send(data);
	});
});

// Server
app.listen(80,function(){
	console.log('App listening on port 80!');
});

// API
app.get('/app/update/:email/pos/:x/:y/:z',function(req,res){

	// Valid Email
	var email = req.params.email;
	if(toolbox_verifyEmail(email)){

		// User Data
		var user;
		fs.readFile(__dirname+'/db/'+email+'.json',function(err,data){
			// user = JSON.parse(data);
			res.send(data);
			console.log(data);
		});

		// Update User Data
		// user.x = req.params.x;
		// user.y = req.params.y;
		// user.z = req.params.z;

		// Store User Data
		fs.writeFile(__dirname+'/db/'+email+'.json',JSON.stringify(user),function(err){
			// Handle Errors
		});

		// Update Online List
		online[email] = new Date().getTime();

	}
});

function toolbox_verifyEmail(email){
	var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
	return re.test(email);
}

var timer_updateOnline = setInterval(function(){
	var now = new Date().getTime();
	for(var email in online){
		if(!online.hasOwnProperty(email)) continue;
		if(online[email] < now-(15*60*1000)){
			console.log('Account '+email+' disconnected (inactive).');
			delete online[email];
		}
	}
}, 1000);