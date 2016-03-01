
var _data = {
    locations: [
        {
            groupId: "derp",
            userId: "joe",
            loc: {lat: 123, lng: 234, altitude: 800, accuracy: 10, speed: 5, time: 1289320229}
        },
        {
            groupId: "derp",
            userId: "bill",
            loc: {lat: 123, lng: 234, altitude: 800, accuracy: 10, speed: 5, time: 1289320229}
        }
    ]
};

//
// List all the group names that are active.
//
exports.listGroups = function(req, res) {
    var i;
    var locs = _data.locations;

    var out = [];

    var name;

    for(i = 0; i < locs.length; ++i) {
        name = locs[i].groupId;
        if(out.indexOf(name) === -1) {
            out.push(name);
        }
    }

    res.json(out);
};

//
// Post a location. The post body specifies groupId, userId, and location. 
// The posted data replaces any other data for the specified groupId and userId
//
exports.postLocation = function(req, res) {
    var locs = _data.locations;
    var groupId = req.body.groupId;
    var userId = req.body.userId;
    var loc = req.body.location || req.body.loc;
    var i;
    var found = false;

    if(groupId && userId && loc) {
        for(i = 0; i < locs.length; ++i) {
            if(groupId === locs[i].groupId && userId === locs[i].userId) {
                _data.locations[i].location = loc;
                found = true;
                break;
            }
        }

        if(!found) {
            _data.locations.push(req.body);
        }

        // Return what the user posted
        res.json(req.body);
    }
    else {
        res.json({
            error: "groupId, userId, and location must be specified in the body"
        });
    }
};

//
// List all of the users in the specified group, and their current locations.
//
exports.listUsers = function(req, res) {
    console.log("req.groupId=" + req.param("groupId"));

    var groupId = req.param("groupId");
    var out = [];
    var i;
    var locs = _data.locations;

    if(groupId) {
        for(i = 0; i < locs.length; ++i) {
            if(locs[i].groupId === groupId) {
                out.push(locs[i]);
            }
        }

        res.json(out);
    }
    else {
        res.json({
            error: "groupId is required"
        });
    }


    // var out = [
    //     {
    //         name: "user1",
    //         locations: [
    //             {lat: 123.00, lng: 234.00, alt: 80, speed: 10, accuracy: 5, time: 12345678},
    //             {lat: 123.00, lng: 234.00, alt: 80, speed: 10, accuracy: 5, time: 23456789}
    //         ]
    //     },
    //     {
    //         name: "user2",
    //         locations: [
    //             {lat: 123.00, lng: 234.00, alt: 80, speed: 10, accuracy: 5, time: 12345678},
    //             {lat: 123.00, lng: 234.00, alt: 80, speed: 10, accuracy: 5, time: 23456789}
    //         ]
    //     }
    // ]
    // ;
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
        for(i = 0; i < locs.length; ++i) {
            if(locs[i].groupId === groupId && locs[i].userId === userId) {
                res.json(locs[i]);
                break;
            }
        }
    }
    else {
        res.json({
            error: "groupId and userId are required"
        });
    }

    // var out = {
    //     name: "user1",
    //     locations: [
    //         {lat: 123.00, lng: 234.00, alt: 80, speed: 10, accuracy: 5, time: 12345678},
    //         {lat: 123.00, lng: 234.00, alt: 80, speed: 10, accuracy: 5, time: 23456789}
    //     ]
    // };

    // res.json(out);
};

//
// Clear the specified group/user's location
//
exports.deleteUserLocation = function(req, res) {
    var groupid = req.groupId;
    var userId = req.userId;
    var locs = _data.locations;
    var i;

    if(groupId && userId) {
        for(i = 0; i < locs.length; ++i) {
            if(locs[i].groupId == groupId && locs[i].userId == userId) {
                _data.locations.splice(i, 1);
                break;
            }
        }

        res.json({
            status: "ok"
        });
    }
    else {
        res.json({
            error: "groupId and userId are required"
        });
    }
};
