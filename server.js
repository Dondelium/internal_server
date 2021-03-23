require('dotenv').config()
const express =    require('express'),
      bodyParser = require('body-parser'),
      http =       require('http'),
      api =        require('./app/router'),
      util =       require('./app/common/util'),
      parsec =     require('./app/parsec'),
      logger =     require('./app/common/logger');
var app = express();
var port = 8080;

//-----------------------------------------------
//-----------------------------------------------
//-----------------------------------------------
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(logger.morgan);

//-----------------------------------------------
app.all('*', parsec.check_local_cidr);

//-----------------------------------------------
app.use('/api/', api);

//-----------------------------------------------
app.all('*', function(req, res, next){
  parsec.file_provider(req, res, '/dist', __dirname+'/dist/index.html');
});

//-----------------------------------------------
//-----------------------------------------------
//-----------------------------------------------
var server = http.createServer(app);
server.listen(port, () => {
  logger.log('----------------------------------');
  logger.log(`Server initalized:`);
  logger.log(`On Machine: ${util.get_machine()}`);
  logger.log(`As User: ${util.get_user()}`);
  logger.log('----------------------------------');
  logger.log(`Access local server at http://localhost:${port}/:`);
  logger.log('----------------------------------\n');
});