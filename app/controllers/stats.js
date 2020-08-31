const pools = require('./../common/pools'),
      response = require('./../common/response');
var stats = {};

//-----------------------------------------------
//-----------------------------------------------
//-----------------------------------------------
stats.routes = [
  {method: 'get', path: '/send', src: 'set_status'}
];
//-----------------------------------------------
//-----------------------------------------------
//-----------------------------------------------
stats.set_status = function(req, res){
  var info = req.body;
/*{
  "mem_info": {
    "max": 948072,
    "free": 394376,
    "used": 553696
  },
  "cpu_info": {
    "cpu": {
      "active": 84839,
      "cycles": 7043554
    },
    "cpu0": {
      "active": 27987,
      "cycles": 1752746
    },
    "cpu1": {
      "active": 12608,
      "cycles": 1764281
    },
    "cpu2": {
      "active": 34723,
      "cycles": 1764612
    },
    "cpu3": {
      "active": 9521,
      "cycles": 1761914
    }
  },
  "temps": "52.6'C\n"
}*/
  pools.query(`SELECT now() AS dttm;`, null, function(err, res){
    if(err) return response.send_failure(req, 'db check error', err);
    response.send_success(req, 'DB connection successful.', res);
  });
};

//-----------------------------------------------
//-----------------------------------------------
//-----------------------------------------------
module.exports = stats;