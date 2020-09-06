const pools = require('./../common/pools'),
      response = require('./../common/response');
var stats = {};

//-----------------------------------------------
//-----------------------------------------------
//-----------------------------------------------
stats.routes = [
  {method: 'post', path: '/send', src: 'set_status'}
];
//-----------------------------------------------
//-----------------------------------------------
//-----------------------------------------------
stats.set_status = function(req, res){
  var info = req.body;
  var ip = req.connection.remoteAddress;
  var cpu = info.cpu_info.cpu;
  sql = 'INSERT INTO monitor.board_stats (ip, mem_used, mem_max, cpu_temp, cpu_active, cpu_cycles) VALUES ($1, $2, $3, $4, $5, $6);';
  pools.query(sql, [ip, info.mem_info.used, info.mem_info.max, info.temps, cpu.active, cpu.cycles], function(err, res){
    if(err) return response.send_failure(req, 'Stat injection error.', err);
    response.send_success(req, 'DB connection successful.', res);
  });
  
  for(var key in info.cpu_info){
    if(key == 'cpu') continue;
    sql = 'INSERT INTO monitor.core_stats (ip, core_name, core_active, core_cycles) VALUES ($1, $2, $3, $4);';
    pools.query(sql, [ip, key, info.cpu_info[key].active, info.cpu_info[key].cycles], function(err, res){
      if(err) console.error(err);
    });
  }
  
  if(new Date().getMinutes() < 5) stats.clean_aged_logs();
};

//-----------------------------------------------
stats.clean_aged_logs = function(){
  var sql = "DELETE FROM monitor.board_stats WHERE entry_dttm < (now() - '24:00:00.000'::interval);";
  sql += "DELETE FROM monitor.core_stats WHERE entry_dttm < (now() - '24:00:00.000'::interval);";
  pools.query(sql, [], function(err, res){
      if(err) console.error(err);
  });
}

//-----------------------------------------------
//-----------------------------------------------
//-----------------------------------------------
module.exports = stats;