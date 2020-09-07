const pools = require('./pools'),
      util = require('./util');
var logger = {};
var base = {};

//-----------------------------------------------
//-----------------------------------------------
//-----------------------------------------------
logger.log = function(entry, key = base){
  console.log(`[${util.date_to_num_slash()}]: ${entry}`);
};

//-----------------------------------------------
logger.warning = function(entry, key = base){
  logger.log(`Warning: ${entry}`);
};

//-----------------------------------------------
logger.error = function(entry, key = base){
  if(entry.stack) entry = entry.stack;
  logger.log(`*****ERROR***** ${entry}`);
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
logger.morgan = function(req, res, next){
  logger.log(`${req.connection.remoteAddress} ${req.method} ${req.url}`);
  next();
};

//-----------------------------------------------
//-----------------------------------------------
//-----------------------------------------------
module.exports = logger;