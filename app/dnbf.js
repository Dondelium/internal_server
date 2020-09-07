const fs = require('fs'),
      path = require('path'),
      readline = require('readline'),
      util = require('./common/util');
var dnbf = {};

//-----------------------------------------------
//-----------------------------------------------
//-----------------------------------------------
dnbf.send_file = function(res, filepath){
  var complete = function(file){
    if(file) return res.send(file);
    res.sendFile(filepath);
  };
  
  dnbf.check_file_for_header(filepath, function(params){
    if(params)
      dnbf[params[0]](filepath, params.slice(1,params.length-1), complete);
    else complete();
  });
};

//-----------------------------------------------
dnbf.check_file_for_header = function(filepath, callback){
  var index = 0;
  var readStream = fs.createReadStream(filepath);
  var lineReader = readline.createInterface({input: readStream});
  lineReader.on('line', function(line){
    var closeval = null;
    if(line.indexOf('#dnbf') != -1)
      closeval = line.split('#dnbf:')[1].split(';');
    if(closeval || index == 1){
      readStream.close();
      lineReader.close();
      lineReader.removeAllListeners();
      callback(closeval);
    }
    index++;
  });
};

//-----------------------------------------------
dnbf.template = function(filepath, params, callback){
  var filestr = fs.readFileSync(filepath, {encoding:'utf8', flag:'r'}).split(/<dnbf>|<\/dnbf>/);
  var base_path = filepath.substr(0, filepath.lastIndexOf('\\'));

  try{
    for(var i = 1; i < filestr.length; i += 2)
      filestr[i] = dnbf.template(path.resolve(base_path + filestr[i]));
  } catch(err){console.log(err);}

  filestr = filestr.join('');

  if(callback) return callback(filestr);
  return filestr;
};

//-----------------------------------------------
// Hook
//-----------------------------------------------
module.exports = function(req, res, next){
  res.dbnf_sendFile = function(filepath){
    dnbf.send_file(res, filepath);
  };
  next();
};
