const path = require('path'),
      parsec = require('./parsec');
var provider = {};

//-----------------------------------------------
//-----------------------------------------------
//-----------------------------------------------
provider.file_provider = function(req, res, folder, default_path = false){
  var filepath = parsec.parse_path(req, folder);

  if(filepath)
    return res.sendFile(path.resolve(filepath));

  if(default_path)
    return res.sendFile(path.resolve(default_path));

  res.send(parsec.build_error_response(req, res, 404, `Requested file: ${req.path} does not exist.`));
};

//-----------------------------------------------
//-----------------------------------------------
//-----------------------------------------------
module.exports = provider;