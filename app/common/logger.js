const pools = require('./pools'),
      util = require('./util');
var logger = {},
    log_id = '',
    logger_db = 'lan',
    logger_schema = 'monitor',
    logger_table = 'log_storage';

//-----------------------------------------------
//-----------------------------------------------
//-----------------------------------------------
logger.log = function(entry){
  logger.store_log(entry);
  console.log(`[${util.date_to_num_slash()}]: ${entry}`);
};

//-----------------------------------------------
logger.warning = function(entry){
  logger.log(`Warning: ${entry}`);
};

//-----------------------------------------------
logger.error = function(entry){
  if(entry.stack) entry = entry.stack;
  logger.log(`*****ERROR***** ${entry}`);
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
logger.get_run_id = function(){
  if(log_id) return;

  log_id = `${util.get_time_hex(new Date())}-${util.get_machine()}`;
  logger.log('Initializing new log:\n');

  var query = `DELETE FROM ${logger_schema}.${logger_table} WHERE (now() - entry_dttm) > '7 days'::interval;`;
  pools.query_db(logger_db, query, [], function(err, res){
    if(err) console.error(err);
  });
  return;
};

//-----------------------------------------------
logger.store_log = function(entry){
  logger.get_run_id();
  
  var query = `INSERT INTO ${logger_schema}.${logger_table} (log_id, entry_dttm, log_entry) VALUES ($1, now(), $2);`;
  pools.query_db(logger_db, query, [log_id, entry], function(err, res){
    if(err) console.error(err);
  });
};

//-----------------------------------------------
//-----------------------------------------------
//-----------------------------------------------
module.exports = logger;