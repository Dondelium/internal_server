const logger = require('./logger');
var response = {};

//-----------------------------------------------
//-----------------------------------------------
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
response.send_error = function(req, code, details = 'N/A'){
  req.res.status(code);  
  response.send_response(req, {
    errorcode: code,
    heading: error_code_map[code].title,
    message: error_code_map[code].message,
    details: details
  });
};

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