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

  for(var i in info.cpu.cores)
    info.cpu.cores[i] = Math.round(info.cpu.cores[i]);

  var sql = 'INSERT INTO monitor.board_stats (ip, mem_used, mem_max, cpu_temp, cpu_load, core_data) VALUES ($1, $2, $3, $4, $5, $6);';
  pools.query(sql, [ip, info.mem.used, info.mem.total, Math.round(info.temp.main), Math.round(info.cpu.cpu), JSON.stringify(info.cpu.cores)], function(err, res){
    if(err) return response.send_failure(req, 'Stat injection error.', err);

    pools.query("DELETE FROM monitor.board_stats WHERE entry_dttm < (now() - '24:00:00.000'::interval);", [], function(err, res){
      if(err) return response.send_failure(req, 'Stat cleanup error.', err);

      response.send_success(req, 'DB connection successful.', {});
    });
  });
};

//-----------------------------------------------
//-----------------------------------------------
//-----------------------------------------------
module.exports = stats;