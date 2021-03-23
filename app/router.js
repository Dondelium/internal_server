const router = require('express').Router(),
      fs = require('fs'),
      response = require('./common/response'),
      logger = require('./common/logger');
var controllers = {};

//-----------------------------------------------
//-----------------------------------------------
//-----------------------------------------------
logger.log(`Beginning route initialization.`);

var files = fs.readdirSync(`${__dirname}/controllers`);
files.forEach(function (file){
  try{
    var filename = file.split('.')[0];
    controllers[filename] = require('./controllers/'+filename);
    for(var i in controllers[filename].routes){
      var route = controllers[filename].routes[i];
      eval(`router.${route.method}('/${filename}${route.path}', controllers.${filename}.${route.src});`);
    }
    logger.log(`Initialization completed for: /app/controllers/${file}`);
  }
  catch(err){
    logger.error(`Initialization failed for: /app/controllers/${file}`);
    logger.error(err);
  }
});

logger.log(`Routing initialization complete.\n`);

//-----------------------------------------------
router.all('*', function(req, res, next){
  response.send_error(req, 400, `No known route for: ${req.method} ${req.path} request.`);
});

//-----------------------------------------------
//-----------------------------------------------
//-----------------------------------------------
module.exports = router;