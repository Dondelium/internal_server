var stats = {
  routes: [
    {method: 'get', path: '/send', src: 'set_status'}
  ]
};

//-----------------------------------------------
//-----------------------------------------------
//-----------------------------------------------
stats.set_status = function(req, res){
  res.send('Controller function executed.');
};

//-----------------------------------------------
//-----------------------------------------------
//-----------------------------------------------
module.exports = stats;