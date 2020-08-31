require('dotenv').config()

//-----------------------------------------------
const express = require('express'),
      bodyParser = require('body-parser'),
      http =    require('http'),
      api =     require('./app/router'),
      util =    require('./app/common/util'),
      logger =  require('./app/common/logger');
var app = express();
var port = 80;

//-----------------------------------------------
//-----------------------------------------------
//-----------------------------------------------
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

//-----------------------------------------------
app.all('*', function(req, res, next){
  logger.morgan(req);
  next();
});

//-----------------------------------------------
//-----------------------------------------------
//-----------------------------------------------
app.use('/api/', api);
app.all('*', function(req, res, next){
  res.send('Hello World!');
});

//-----------------------------------------------
//-----------------------------------------------
//-----------------------------------------------
var server = http.createServer(app);
server.listen(port, () => {
  console.log(`Local server listening on ${port}:`)
});