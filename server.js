const express = require('express'),
      http =    require('http'),
      api =     require('./app/router'),
      util =    require('./app/common/util'),
      logger =  require('./app/common/logger');
var app = express();
var port = 80;

//-----------------------------------------------
//-----------------------------------------------
//-----------------------------------------------
app.all('*', function(req, res, next){
  logger.morgan(req);
  //util.get_obj_struct(req, false);
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