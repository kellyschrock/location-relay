
var _data = {
    // test_group: {
    //     test_user: {
    //         loc: {lat: 123, lng: 234, altitude: 800, accuracy: 10, speed: 5, time: 1289320229}
    //     }
    // }
};

var _locationPostedCallback = null;
var _userDeletedCallback = null;
var _isUserTargetedCallback = null;


//
// List all the group names that are active.
//
exports.listGroups = function(req, res) {
    var out = [];

    var group;

    for(var group in _data) {
        out.push(group);
    }

    res.json(out);
};

//
// List all of the users in the specified group, and their current locations.
//
exports.listUsers = function(req, res) {
    console.log("req.groupId=" + req.param("groupId"));

    var groupId = req.param("groupId");
    var out = [];

    if(groupId) {
        var group = _data[groupId];

        if(group) {
            res.json(group);
        }
        else {
            res.json({
                error: "group " + groupId + " not found"
            });
        }
    }
    else {
        res.json({
            error: "groupId is required"
        });
    }
};

//
// Set a location-posted callback.
//
exports.setLocationPostedCallback = function(cb) {
    _locationPostedCallback = cb;
};

//
// Post a location. The post body specifies groupId, userId, and location. 
// The posted data replaces any other data for the specified groupId and userId
//
exports.postLocation = function(req, res) {
    var groupId = req.body.groupId;
    var userId = req.body.userId;
    var loc = req.body.location || req.body.loc;
    var options = req.body.options;
    var userIsIt = false;

    if(_isUserTargetedCallback != null) {
        userIsIt = _isUserTargetedCallback(groupId, userId);
    }

    if(groupId && userId && loc) {
        var group = _data[groupId];
        if(group) {
            var user = group[userId];
            if(user) {
                // replace the location
                _data[groupId][userId].loc = loc;

                if(_locationPostedCallback != null) {
                    _locationPostedCallback(groupId, userId, loc, options);
                }

                res.json({
                    status: "set location ok",
                    it: userIsIt
                });
            }
            else {
                // Add the user/location
                _data[groupId][userId] = {};
                _data[groupId][userId].loc = loc;

                if(_locationPostedCallback != null) {
                    _locationPostedCallback(groupId, userId, loc, options);
                }

                res.json({
                    status: "added user/location to " + groupId,
                    it: userIsIt
                });
            }
        }
        else {
            // Add the group/user/location
            _data[groupId] = {};
            _data[groupId][userId] = {
                loc: loc
            };

            if(_locationPostedCallback != null) {
                _locationPostedCallback(groupId, userId, loc, options);
            }

            res.json({
                status: "added group/user/location",
                it: userIsIt
            });
        }
    }
    else {
        res.json({
            error: "groupId, userId, and location must be specified in the body"
        });
    }
};


//
// Get the current location of the specified user in the specified group.
//
exports.getUserLocation = function(req, res) {
    var groupId = req.param("groupId");
    var userId = req.param("userId");
    
    var locs = _data.locations;
    var i;

    if(groupId && userId) {
        var group = _data[groupId];

        if(group) {
            var user = group[userId];

            if(user) {
                res.json(user);
            }
            else {
                res.json({
                    error: "User " + userId + " not found in " + groupId
                });
            }
        }
        else {
            res.json({
                error: "Group " + groupId + " not found"
            });
        }
    }
    else {
        res.json({
            error: "groupId and userId are required"
        });
    }
};

//
// Set a location-posted callback.
//
exports.setUserDeletedCallback = function(cb) {
    _userDeletedCallback = cb;
}

//
// Set a target location post callback.
//
exports.setIsUserTargetedCallback = function(cb) {
    _isUserTargetedCallback = cb;
}

//
// Clear the specified user's location
//
exports.deleteUserLocation = function(req, res) {
    var groupId = req.param("groupId");
    var userId = req.param("userId");

    if(groupId && userId) {
        var group = _data[groupId];
        if(group) {
            var user = group[userId];
            if(user) {
                delete group[userId];

                if(_userDeletedCallback != null) {
                    _userDeletedCallback(groupId, userId);
                }

                res.json({status: "delete user " + userId + " from " + groupId});
            }
            else {
                res.json({error: "User " + userId + " not found in " + groupId});
            }
        }
        else {
            res.json({error: "Group " + groupId + " not found"});
        }
    }
    else {
        res.json({error: "groupId and userId are required"});
    }
};

//
// Clear the specified group
//
exports.deleteGroup = function(req, res) {
    var groupId = req.param("groupId");

    if(groupId) {
        var group = _data[groupId];
        if(group) {
            delete _data[groupId];
                res.json({status: "Deleted group " + groupId});
        }
        else {
            res.json({error: "Group " + groupId + " not found"});
        }
    }
    else {
        res.json({error: "groupId is required"});
    }
};
