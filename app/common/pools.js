const pg = require('pg');
var pools = {dbs: {}},
    def_base = {
      host: 'server.osf',
      user: process.env.dbid,
      password: process.env.dbpass,
      port: 5432,
      max: 10,
      idleTimeoutMillis: 5000
    },
    default_db = 'lan';

//-----------------------------------------------
//-----------------------------------------------
//-----------------------------------------------
pools.connect_db = function(db_name, callback){
  try{
    if(!pools.dbs[db_name])
      pools.dbs[db_name] = new pg.Pool(Object.assign({database: db_name}, def_base));
    callback(null, pools.dbs[db_name]);
  } catch(err){callback(err);}
};

//-----------------------------------------------
pools.query_db = function(db_name, query, values, callback){
  pools.connect_db(db_name, function(err, pool){
    if(err) return callback(err);
    if(typeof values == 'function'){callback = values; values = null;}

    pool.query(query.replace(/'null'|'NULL'|'undefined'/g, 'NULL'), values, function(err,res){
      if(err) return callback(`${err}\nWith SQL Statement:\n${query}`);

      callback(null, res);
    });
  });
};

//-----------------------------------------------
pools.query = function(query, values, callback){
  pools.query_db(default_db, query, values, callback);
};

//-----------------------------------------------
//-----------------------------------------------
//-----------------------------------------------
module.exports = pools;