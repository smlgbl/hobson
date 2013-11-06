
/**
 * Module dependencies.
 */

var express = require('express');
var routes = require('./routes');
var jobs = require('./routes/jobs');
var hooks = require('./routes/hooks');
var http = require('http');
var path = require('path');

var app = express();

var onlyJson = function(req, res, next) {
  if(req.method !== 'POST' || req.is('json')) next();
  else res.send(406, "POST requests only accept JSON data");
}

app.configure(function(){
  app.set('port', process.env.PORT || 3000);
  app.use(express.favicon());
  app.use(express.logger('dev'));
  app.use(express.bodyParser());
  app.use(onlyJson);
  app.use(express.methodOverride());
  app.use(app.router);
  app.use(express.static(path.join(__dirname, 'public')));
  app.enable('trust proxy');
});

app.configure('development', function(){
  app.use(express.errorHandler());
});

app.get('/', routes.index);
app.get('/status', routes.status);
app.get('/jobs', jobs.list);
app.get('/jobs/:id', jobs.status);
app.get('/jobs/:id/config', jobs.getConfig);
app.post('/jobs/:id/config', jobs.setConfig);
app.post('/jobs', jobs.addJob);
app.del('/jobs/:id', jobs.delJob);
app.get('/hooks', hooks.list);
app.get('/hooks/:id', hooks.status);
app.del('/hooks/:id', hooks.del);
app.post('/hooks/', hooks.create);

http.createServer(app).listen(app.get('port'), function(){
  console.log("Express server listening on port " + app.get('port'));
});
