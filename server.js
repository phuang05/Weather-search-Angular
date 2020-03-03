/*var http = require('http')
http.createServer(function(req,res) {
    res.writeHead(200, {'Content-Type': 'text/plain'})
    res.end('first node')
})
.listen(3000)
console.log('your server is running at http://120.79.xxx.xx:8888/')*/

//const path = require('path');
var express=require('express');
var request = require('request');
var http = require('http');
var xmlreader = require('xmlreader');
var fs = require("fs");

var app=new express();


app.all('*',function (req, res, next) {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Headers', 'Content-Type, Content-Length, Authorization, Accept, X-Requested-With , yourHeaderFeild');
  res.header('Access-Control-Allow-Methods', 'PUT, POST, GET, DELETE, OPTIONS');

  if (req.method == 'OPTIONS') {
    res.send(200); /让options请求快速返回/
  }
  else {
    next();
  }
});

/*
app.use(express.static(path.join(__dirname,'dist')));
app.get('/',function(req,res){
	res.sendFile(path.join(__dirname, '/dist/weather-app/index.html'));
});
*/




app.get('/',function(req,res){
	res.setHeader("Content-Type","text/html;charset='utf-8'");
	fs.readFile("./dist/weather-app/index.html","utf-8",function(err,data){
        	if(err) {
        		console.log("index.html loading is failed :"+err);
        	}
        	else{
        		res.end(data);
	        }
             
        });

});









app.get('/geocode',function(req,res){
	console.log(req.query);
//	res.send(req.query.a);
	var street = req.query.street;
	var city = req.query.city;
	var state = req.query.state;
	var lat = 0;
	var lng = 0;
	var dic = new Array();
	var url = "https://maps.googleapis.com/maps/api/geocode/xml?address=" + street + ',' + city + ',' + state + "&key=AIzaSyDE76Q5ZPNUC6VYBdBhd6cl4-xt6DcYDts";
	request(url,function(error,response,body){
		if (!error && response.statusCode == 200){
			//console.log(body);
			//res.send(body);
			xmlreader.read(body,function(err,res){
				if (err) return console.log(err);
				//console.log(res.GeocodeResponse);
				lat = res.GeocodeResponse.result.at(0).geometry.location.lat.text();
				lng = res.GeocodeResponse.result.at(0).geometry.location.lng.text();
			});
			console.log(lat,lng);
			
			res.send(new Array(lat,lng));
		}else{
			res.send('error');	
		}
	});

});


app.get('/forecast',function(req,res){
	console.log(req.query);
//	res.send(req.query.a);
	var lat = req.query.lat;
	var lng = req.query.lng;
	var rs = new Array();

	var url = "https://api.forecast.io/forecast/e9853d8c6612ebcd301961d8e1f1d7e2/" + lat + ',' + lng + "?exclude=minutely,hourly,alerts,flags";
	request(url,function(error,response,body){
		if (!error && response.statusCode == 200){
			//console.log(body);
			var json = JSON.parse(body);
			
			var timezone = json['timezone'];
			//console.log(rs['timezone']);
			//res.json(json['timezone']));
			//res.send(rs);
			//console.log(body);
			
			//res.send(new Array(timezone));
			res.send(body);
		}else{
			res.send('error');	
		}
	});

});



app.get('/detail',function(req,res){
	console.log(req.query);
//	res.send(req.query.a);
	var lat = req.query.lat;
	var lng = req.query.lng;
	var time = req.query.time;
	var rs = new Array();

	var url = "https://api.darksky.net/forecast/e9853d8c6612ebcd301961d8e1f1d7e2/" + lat + ',' + lng + ',' + time + "?exclude=minutely";
	request(url,function(error,response,body){
		if (!error && response.statusCode == 200){
			res.send(body);
		}else{
			res.send('error');	
		}
	});

});


app.get('/statePic',function(req,res){
	console.log(req.query);
//	res.send(req.query.a);
	var state = req.query.state;
	var searchId = "004021967851892122939:rgzz2slzzfr";
	var key="AIzaSyDE76Q5ZPNUC6VYBdBhd6cl4-xt6DcYDts";
	var url = "https://www.googleapis.com/customsearch/v1?q=" + state + "%20State%20Seal&cx=" + searchId + "&imgSize=huge&imgType=news&num=1&searchType=image&key=" + key;
	console.log(url);
	request(url,function(error,response,body){
		if (!error && response.statusCode == 200){
			console.log(111);
			res.send(body);
		}else{
			res.send('error');	
		}
	});

});

app.get('/hourly',function(req,res){
	console.log(req.query);
	var lat = req.query.lat;
	var lng = req.query.lng;
	var key="e9853d8c6612ebcd301961d8e1f1d7e2";
	var url = "https://api.darksky.net/forecast/" + key +"/" + lat + "," + lng + "?exclude=minutely";
	console.log(url);
	request(url,function(error,response,body){
		if (!error && response.statusCode == 200){
			res.send(body);
		}else{
			res.send('error');	
		}
	});

});


app.get('/specificTime',function(req,res){
	console.log(req.query);
	var lat = req.query.lat;
	var lng = req.query.lng;
	var time = req.query.time;
	var key="e9853d8c6612ebcd301961d8e1f1d7e2";
	var url = "https://api.darksky.net/forecast/" + key +"/" + lat + "," + lng + ',' + time  + "?exclude=minutely";
	console.log(url);
	request(url,function(error,response,body){
		if (!error && response.statusCode == 200){
			res.send(body);
		}
		else{
			res.send('error');	
		}
	});

});













app.listen(3000);




