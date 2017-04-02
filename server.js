var express = require('express');
var app = express();
var assets = require('./src/modules/assets');

app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  next();
})

app.use('/assets', assets);

// the port that the app willl luisten to fro any requests
app.set('port',process.env.PORT || 5000);

// middleware for express to know the directory of the static files
app.use(express.static(__dirname + '/dist'));

// get the index page, the only page ever to be served
app.get('/', function(req, res, next) {
  res.sendFile(__dirname + '/dist/index.html');
});

// listen to the aforementioned port
app.listen(app.get('port'), function(req,res,next) {
  console.log('App running on port ', app.get('port'));
});
