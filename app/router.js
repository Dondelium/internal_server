const router = require('express').Router(),
      fs = require('fs'),
      parsec = require('./parsec');
var controllers = {};

//-----------------------------------------------
//-----------------------------------------------
//-----------------------------------------------
var files = fs.readdirSync(`${__dirname}/controllers`);
files.forEach(function (file){
  try{
    var filename = file.split('.')[0];
    controllers[filename] = require('./controllers/'+filename);
    for(var i in controllers[filename].routes){
      var route = controllers[filename].routes[i];
      eval(`router.${route.method}('/${filename}${route.path}', controllers.${filename}.${route.src});`);
    }
    console.log(`Initialization completed for: /app/controllers/${file}`);
  }
  catch(err){
    console.error(`Initialization failed for: /app/controllers/${file}`);
    console.error(err);
  }
});

//-----------------------------------------------
router.all('*', function(req, res, next){
  res.send(parsec.build_error_response(req, res, 400, `No known route for: ${req.method} ${req.path} request.`));
});

//-----------------------------------------------
//-----------------------------------------------
//-----------------------------------------------
module.exports = router;