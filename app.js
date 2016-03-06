
/**
 * Module dependencies.
 */

var express = require('express');
var locService = require('./services/location');
var http = require('http');
var path = require('path');

var app = express();

app.use(function(req, res, next) {
    console.log(req.method + " " + req.url);
    next();
});

// all environments
app.set('port', process.env.PORT || 3000);
app.set('views', path.join(__dirname, 'views'));
// app.set('view engine', 'jade');
app.use(express.favicon());
app.use(express.logger('dev'));
app.use(express.json());
app.use(express.urlencoded());
app.use(express.methodOverride());
app.use(app.router);
app.use(express.static(path.join(__dirname, 'public')));

// development only
if ('development' == app.get('env')) {
  app.use(express.errorHandler());
}

app.get('/', function(req, res) {res.sendfile('views/index.html'); });
app.get('/map', function(req, res) {res.sendfile('views/map.html'); });

// app.get('/', routes.index);
// app.get('/users', user.list);

// Post a location for a user in a group. The post body specifies groupId, userId, and location.
app.post('/follow/user', locService.postLocation);
// Delete location data for the specified user
app.del('/follow/user/:groupId/:userId', locService.deleteUserLocation);
// Delete the specified group
app.del('/follow/group/:groupId', locService.deleteGroup);
// List groups
app.get('/follow/groups', locService.listGroups);
// List users and their locations in the specified group
app.get('/follow/group/:groupId', locService.listUsers);
// Get the current location for the specified user in the specified group
app.get('/follow/user/:groupId/:userId', locService.getUserLocation);

http.createServer(app).listen(app.get('port'), function() {
    console.log('Express server listening on port ' + app.get('port'));
});
