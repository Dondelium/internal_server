const os = require('os'),
      util = require('./common/util');
var parsec = {}, mask = '', cidr = '';

//-----------------------------------------------
//-----------------------------------------------
//-----------------------------------------------
parsec.check_local_cidr = function(req){
  var rem_ip = req.connection.remoteAddress.replace('::ffff:','');
  return util.ipncidr(util.ip2binary(rem_ip), cidr, mask);
};

//-----------------------------------------------
function get_local_info(){
  var nets = os.networkInterfaces();
  for(var name in nets){
    for(var i in nets[name]){
      var net = nets[name][i];
      if(net.family != 'IPv4' || name.indexOf('Loopback') != -1) continue;

      mask = util.ip2binary(net.netmask);
      cidr = util.ip2binary(net.cidr.split('/')[0]);
      var ip = util.ip2binary(net.address);
      if(util.ipncidr(ip, cidr, mask)) return;
    }
  }
  throw 'Unable to find suitable interface for CIDR comparsion.';
} get_local_info();

//-----------------------------------------------
//-----------------------------------------------
//-----------------------------------------------
module.exports = parsec;