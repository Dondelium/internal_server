const logger = require('./logger');
var response = {};

//-----------------------------------------------
//-----------------------------------------------
//-----------------------------------------------
response.send_success = function(req, message, data){
  response.send_response(req, {
    success: true,
    result: {message:message, data: data}
  });
};

//-----------------------------------------------
response.send_failure = function(req, message, error){
  if(error.stack) error = error.stack;
  try{
    if(''+error == '[object Object]') error = JSON.stringify(error);
  } catch(err){error = '[Unparsable object]'}
  logger.error(error, req);

  response.send_response(req, {
    success: false,
    result: {message:message, data: error}
  });
};

//-----------------------------------------------
response.send_response = function(req, payload){
  logger.close_file(req);
  req.res.send(payload);
};

//-----------------------------------------------
//-----------------------------------------------
//-----------------------------------------------
module.exports = response;