const os = require('os'),
      fs = require('fs'),
      util = require('./common/util');
var parsec = {}, mask = '', cidr = '';

//-----------------------------------------------
// Setup
//-----------------------------------------------
var error_code_map = {
  400 : {"title":"Bad Request", "message":"The request could not be understood by the server."},
  401 : {"title":"Unauthorized", "message":"Administrative access required."},
  403 : {"title":"Forbidden", "message":"Client address location outside approved provider zone."},
  404 : {"title":"Not Found", "message":"Requested source not found."},
  412 : {"title":"Precondition Failed", "message":"Login required. The client has either not logged in, lost credentials, or their session has timed out."},
  420 : {"title":"Enhance Your Calm", "message":"Client rate limited."},
};

//-----------------------------------------------
function get_local_info(){
  var nets = os.networkInterfaces();
  for(var name in nets){
    for(var i in nets[name]){
      var net = nets[name][i];
      if(net.family != 'IPv4' || name.indexOf('Loopback') != -1 || name == 'lo') continue;

      mask = util.ip2binary(net.netmask);
      cidr = util.ip2binary(net.cidr.split('/')[0]);
      var ip = util.ip2binary(net.address);
      if(util.ipncidr(ip, cidr, mask)) return;
    }
  }
  throw 'Unable to find suitable interface for CIDR comparsion.';
} get_local_info();

//-----------------------------------------------
// Security
//-----------------------------------------------
parsec.check_local_cidr = function(req){
  var rem_ip = req.connection.remoteAddress.replace('::ffff:','');
  return util.ipncidr(util.ip2binary(rem_ip), cidr, mask);
};

//-----------------------------------------------
// Parse
//-----------------------------------------------
parsec.parse_path = function(req, folder){
  var parts = req.path.split('/');

  if(!parts[parts.length-1]) parts[parts.length-1] = 'index.html';
  if(parts[parts.length-1].indexOf('.') == -1) parts[parts.length-1] += '.html'
  
  var path = `${__dirname}/..${folder.indexOf(parts[1]) == -1 ? folder : ''}${parts.join('/')}`;
  if (fs.existsSync(path))
    return path;
  return false;
  if(parts[parts.length-1] != 'index.html')
    return __dirname + '/../public/404.html';
  return false;
};

//-----------------------------------------------
parsec.build_error_response = function(req, res, errorcode, details = 'N/A'){
  res.status(errorcode);
  return {errorcode: errorcode, heading: error_code_map[errorcode].title, message: error_code_map[errorcode].message, details: details};
};

//-----------------------------------------------
//-----------------------------------------------
//-----------------------------------------------
module.exports = parsec;
