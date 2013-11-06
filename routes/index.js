
/*
 * GET home page.
 */

exports.index = function(req, res){
  res.send('Please use the API');
};

exports.status = function(req, res) {
  var status = {
    healthy: true,
    time: Date.now()
  };

  res.json(200, status);
};

