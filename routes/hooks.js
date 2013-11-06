
/*
 * GET hooks listing.
 */

var hooks = [
  'github',
  'bitbucket',
  'npm'
];

exports.list = function(req, res){
  res.json(200, hooks);
};

exports.status = function(req, res) {
  var id = req.params.id;
  var no = hooks.indexOf(id);
  if(no === -1) {
    res.send(404);
    return;
  }
  var status = {
    name: id,
    status: 'active'
  };
  res.json(200, status);
};

exports.create = function(req, res) {
  if('name' in req.body) {
    var name = req.body.name;
    if(hooks.indexOf(name) === -1) {
      hooks.push(name);
      res.json(201, {name: name});
    } else {
      res.send(400, {error: "Hook with that name already exists."});
    }
  } else {
    res.send(400, {error: "New hook needs a name."});
  }
};

exports.del = function(req, res) {
  if('name' in req.body) {
    var name = req.body.name;
    if(hooks.indexOf(name) !== -1) {
      hooks.splice(hooks.indexOf(name), 1);
      res.json(201, {name: name});
    } else {
      res.send(404);
    }
  } else {
    res.send(400, {error: "Need a name to delete a hook."});
  }
};

