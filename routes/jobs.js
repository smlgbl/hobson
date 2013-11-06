
/*
 * GET jobs listing.
 */

var jobs = [
  'standard',
  'jenkins users',
  'Rock the cradle',
  'Build the new order'
];

exports.list = function(req, res){
  res.json(200, jobs);
};

exports.getConfig = function(req, res) {
  var id = req.params.id;
  var no = jobs.indexOf(id);
  if(no === -1) {
    res.send(404);
  } else {
    res.send(200, {enabled: true});
  }
};

exports.setConfig = function(req, res) {
  var id = req.params.id;
  var no = jobs.indexOf(id);
  if(no === -1) {
    res.send(404);
  } else {
    res.send(200);
  }
};

exports.status = function(req, res) {
  var id = req.params.id;
  var no = jobs.indexOf(id);
  if(no === -1) {
    res.send(404);
    return;
  }
  var status = {
    name: id,
    status: 'running'
  };
  res.json(200, status);
};

exports.addJob = function(req, res) {
  if('name' in req.body) {
    var name = req.body.name;
    if(jobs.indexOf(name) === -1) {
      jobs.push(name);
      res.json(201, {name: name});
    } else {
      res.send(400, {error: "Job with that name already exists."});
    }
  } else {
    res.send(400, {error: "New job needs a name."});
  }
};

exports.delJob = function(req, res) {
  if('name' in req.body) {
    var name = req.body.name;
    if(jobs.indexOf(name) === -1) {
      jobs.splice(jobs.indexOf(name), 1);
      res.json(201, {name: name});
    } else {
      res.send(404);
    }
  } else {
    res.send(400, {error: "Need a name to delete a job."});
  }
};

