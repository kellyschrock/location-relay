
/**
 * Module dependencies.
 */

var express = require('express');
var locService = require('./services/location');
var http = require('http');
var path = require('path');
var WebSocketServer = require('ws').Server;

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
app.get('/solex-swag', function(req, res) {res.sendfile('views/solex-swag.html'); });
app.get('/target', function(req, res) {res.sendfile('views/target.html'); });
app.get('/apidoc', function(req, res) {res.sendfile('views/api_doc.html'); });
app.get('/ws', function(req, res) {res.sendfile('views/ws.html'); });

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
// Return the caller's IP address
app.get('/client/myip', function(req, res) {
    var ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress
    if(ip.indexOf("::ffff:") >= 0) {
        ip = ip.substring("::ffff:".length);
    }
    
    res.send(ip);
});

var server = http.createServer(app);

// Websockets
var groupSubscribers = {};
var userSubscribers = {};

var wss = new WebSocketServer({server: server});

// Called when the target POST handler wants to know if a user
// is specifically being followed.
locService.setIsUserTargetedCallback(function(groupId, userId) {
    var id = _makeId(groupId, userId);
    var client = userSubscribers[id];
    return (client)? true: false;
});

// Called from locationService when a user posts a location.
locService.setLocationPostedCallback(function(groupId, userId, location, options) {
    console.log("user location broadcast");

    var out = {
        type: "location", 
        groupId: groupId, 
        userId: userId, 
        location: location,
        options: options
    };

    var str = JSON.stringify(out);

    wss.publishToGroup(groupId, str);

    out.type = "user_location";
    str = JSON.stringify(out);

    wss.publishToGroupAndTarget(groupId, userId, str);
});

// Called when a user stops tracking on their device.
locService.setUserDeletedCallback(function(groupId, userId) {
    console.log("user deleted from group " + groupId + ": " + userId);

    var out = {
        type: "delete",
        groupId: groupId, 
        userId: userId
    };

    var str = JSON.stringify(out);

    wss.publishToGroupAndTarget(groupId, userId, str);
    wss.publishToGroup(groupId, str);
});

// Send a WS message, and get an ack or an error.
function send(ws, data) {
    ws.send(data, function(error) {
        // if no error, send worked.
        // otherwise the error describes the problem.
    });
}

function _makeId(g, u) {
    return g + "/" + u;
}

wss.publishToGroup = function(groupId, data) {
    // find the clients that are listening for groupId and send them the data.
    var client = groupSubscribers[groupId];
    if(client) {
        send(client, data);
    }
};

wss.publishToGroupAndTarget = function(groupId, userId, data) {
    // find the clients that are listening for groupId/userId, and send them data.
    var client = userSubscribers[_makeId(groupId, userId)];
    if(client) {
        send(client, data);
    }
};

// Send a message to all clients
wss.broadcast = function(data) {
    wss.clients.foreach(function(client) {
        client.send(data);
    });
};

// websockets stuff
wss.on('connection', function(client) {
    // got a message from the client
    client.on('message', function(data) {
        console.log("received message %s", data);

        try {
            var jo = JSON.parse(data);

            if(jo.type) {
                switch(jo.type) {
                    case "subscribe": {
                        var groupId = jo.groupId;
                        var userId = jo.userId;

                        if(groupId) {
                            if(userId) {
                                // This is for following a specific user.
                                var id = _makeId(groupId, userId);
                                userSubscribers[id] = client;   

                                send(client, "subscribed to " + id);
                            }
                            else {
                                // This is just for following the group.
                                groupSubscribers[groupId] = client;
                                send(client, "subscribed to " + groupId);
                            }
                        }
                        else {
                            // send an error back to the client.
                            send(client, "groupId is required at least");
                        }

                        break;
                    }

                    case "unsubscribe": {
                        var groupId = jo.groupId;
                        var userId = jo.userId;

                        if(groupId) {
                            if(userId) {
                                var id = _makeId(groupId, userId);
                                delete userSubscribers[id];
                                send(client, "unsubscribed from " + id);
                            }
                            else {
                                delete groupSubscribers[groupId];
                                send(client, "unsubscribed from " + groupId);
                            }
                        }
                        else {
                            send(client, "groupId is required at least");
                        }

                        break;
                    }

                    case "ping": {
                        send(client, "ok");
                        break;
                    }
                }
            }
        }
        catch(err) {
            console.log(err);
            send(client, "error in " + data);
        }
    });

    client.on('close', function() {
        console.log("connection closed");
    });

    // Send a connected message back to the client
    send(client, "connected");
});

// End websockets

server.listen(app.get('port'), function() {
    console.log('Express server listening on port ' + app.get('port'));
});
