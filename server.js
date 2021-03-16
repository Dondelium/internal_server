require('dotenv').config()
const express =    require('express'),
      bodyParser = require('body-parser'),
      http =       require('http'),
      api =        require('./app/router'),
      util =       require('./app/common/util'),
      parsec =     require('./app/parsec'),
      logger =     require('./app/common/logger');
var app = express();
var port = 80;

//-----------------------------------------------
//-----------------------------------------------
//-----------------------------------------------
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(logger.morgan);

//-----------------------------------------------
app.all('/static/*', function(req, res, next){
  parsec.file_provider(req, res, '/static');
});

//-----------------------------------------------
app.all('*', function(req, res, next){
  if(!parsec.check_local_cidr(req))
    return res.send(parsec.build_error_response(req, res, 403));
  next();
});

//-----------------------------------------------
app.use('/api/', api);

//-----------------------------------------------
app.all('*', function(req, res, next){
  parsec.file_provider(req, res, '/dist', __dirname+'/dist/404.html');
});

//-----------------------------------------------
//-----------------------------------------------
//-----------------------------------------------
var server = http.createServer(app);
server.listen(port, () => {
  console.log(`Local server listening on ${port}:`)
});