var util = {};

//-----------------------------------------------
//-----------------------------------------------
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
//-----------------------------------------------
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