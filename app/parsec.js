const fs = require('fs'),
      path = require('path'),
      util = require('./common/util'),
      response = require('./common/response');
var parsec = {}, mask = '', cidr = '';

//-----------------------------------------------
// Setup
//-----------------------------------------------
function get_local_info(){
  var nets = util.get_ip4_networks();
  for(var i in nets){
    var net = nets[i];
    mask = util.ip2binary(net.netmask);
    cidr = util.ip2binary(net.cidr.split('/')[0]);
    if(util.ipncidr(util.ip2binary(net.address), cidr, mask)) return;
  }

  throw 'Unable to find suitable interface for CIDR comparsion.';
} get_local_info();

//-----------------------------------------------
// Security
//-----------------------------------------------
parsec.check_local_cidr = function(req, res, next){
  var rem_ip = req.connection.remoteAddress.replace('::ffff:','');

  if(!util.ipncidr(util.ip2binary(rem_ip), cidr, mask))
    return response.send_error(req, 403);

  next();
};

//-----------------------------------------------
// File provision
//-----------------------------------------------
parsec.file_provider = function(req, res, folder, default_path = false){
  var filepath = parse_path(req, folder);

  if(filepath)
    res.sendFile(path.resolve(filepath));
  else if(default_path)
    res.sendFile(path.resolve(default_path));
  else
    response.send_error(req, 404, `Requested file: ${req.path} does not exist.`);
};

//-----------------------------------------------
function parse_path(req, folder){
  var parts = req.path.split('/');

  if(!parts[parts.length-1]) parts[parts.length-1] = 'index.html';
  if(parts[parts.length-1].indexOf('.') == -1) parts[parts.length-1] += '.html'
  
  var path = `${__dirname}/..${folder.indexOf(parts[1]) == -1 ? folder : ''}${parts.join('/')}`;
  if (fs.existsSync(path))
    return path;
  return false;
}

//-----------------------------------------------
//-----------------------------------------------
//-----------------------------------------------
module.exports = parsec;
