const os = require('os');
var util = {};

//-----------------------------------------------
// General Functions
//-----------------------------------------------
util.leadingzeros = function(string, len){
  string = ''+string;
  while(string.length < len) string = '0'+string;
  return string;
};

//-----------------------------------------------
util.date_to_num_slash = function(d){
  if(!d) d = new Date();
  var lz = util.leadingzeros;
  var date = `${lz(d.getFullYear(),4)}/${lz(d.getMonth()+1,2)}/${lz(d.getDate(),2)}`;
  var time = `${lz(d.getHours(),2)}:${lz(d.getMinutes(),2)}:${lz(d.getSeconds(),2)}.${lz(d.getMilliseconds(),3)}`;
  return `${date} ${time}`;
};

//-----------------------------------------------
util.format_bytes = function(bytes) {
  if(!bytes || typeof bytes != 'number') return 'NaN';

  var k = 1024, i = 0, sizes = ['B', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];
  while(bytes > k && i < sizes.length){
    bytes /= k;
    i++;
  }

  return bytes.toFixed(2)+' '+sizes[i];
};

//-----------------------------------------------
// Actual Utility - Little to no use beyond dev
//-----------------------------------------------
util.get_obj_struct = function(req, godeep){
  for(var key in req){
    var type = typeof req[key];
    if(type == 'function') continue;
    if(type != 'object')
      console.log(`[${key}]: ${req[key]}`);
    else if(godeep){
      try {console.log(`[${key}]: ${JSON.stringify(req[key])}`);}
      catch(err){console.log(`[${key}]: [Unparsable object]`);}
    }
  }
};

util.nano_time_diff = function(start){
  var split = util.leadingzeros(process.hrtime.bigint() - start,10);
  return split.slice(0,-9)+'.'+split.slice(-9);
};

//-----------------------------------------------
// ID / HEX / logger / OS stuff
//-----------------------------------------------
util.get_time_hex = function(){
  return new Date().getTime().toString(16);
};

//-----------------------------------------------
util.get_machine = function(){
  return os.hostname();
};

//-----------------------------------------------
util.get_user = function(){
  return os.userInfo().username;
};

//-----------------------------------------------
// IP CIDR check system
//-----------------------------------------------
util.get_ip4_networks = function(){
  var nets = os.networkInterfaces();
  var ip4_nets = [];

  for(var name in nets){
    if(name == 'lo') continue;

    for(var i in nets[name]){
      var net = nets[name][i];
      if(net.family != 'IPv4' || name.indexOf('Loopback') != -1) continue;
      ip4_nets.push(net);
    }
  }
  
  return ip4_nets;
};

//-----------------------------------------------
util.ipncidr = function(ip, cidr, mask){
  for(var i = 0; i < mask.length; i++){
    if(mask[i] == 0) break;
    if(ip[i] == cidr[i]) continue;
    return false;
  }
  return true;
};

//-----------------------------------------------
util.ip2binary = function(ip){
  var bins = ''; ip = ip.split('.');
  for(var i in ip) bins += util.dec2bin(ip[i]);
  return bins;
};

//-----------------------------------------------
util.dec2bin = function(dec){
  return util.leadingzeros((dec >>> 0).toString(2), 8);
};

//-----------------------------------------------
//-----------------------------------------------
//-----------------------------------------------
module.exports = util;