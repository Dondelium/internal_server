const pools = require('./pools');
var logger = {};
var base = {};

//-----------------------------------------------
//-----------------------------------------------
//-----------------------------------------------
logger.morgan = function(req){
  console.log(`[${req.connection.remoteAddress}]: ${req.method} ${req.url}`);
};

//-----------------------------------------------
logger.log = function(entry, key = base){
  console.log(entry);
};

//-----------------------------------------------
logger.warning = function(entry, key = base){
  console.log(entry);
};

//-----------------------------------------------
logger.error = function(entry, key = base){
  console.error(entry);
};

//-----------------------------------------------
logger.open_file = function(key){
  console.log('Opened file');
};

//-----------------------------------------------
logger.close_file = function(key){
  console.log('Closed file');
};

//-----------------------------------------------
//-----------------------------------------------
//-----------------------------------------------
module.exports = logger;