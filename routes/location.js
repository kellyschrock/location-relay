
exports.listGroups = function(req, res) {
    var out = [
        "group1", "group2"
    ];

    res.json(out);
};

exports.postLocation = function(req, res) {
    var groupId = req.groupId;
    var userId = req.userId;

    res.send("post the user's location in the specified group, and send something back");
};

exports.listUsers = function(req, res) {
    var groupId = req.groupId;

    var out = [
        {
            name: "user1",
            locations: [
                {lat: 123.00, lng: 234.00, alt: 80, speed: 10, accuracy: 5, time: 12345678},
                {lat: 123.00, lng: 234.00, alt: 80, speed: 10, accuracy: 5, time: 23456789}
            ]
        },
        {
            name: "user2",
            locations: [
                {lat: 123.00, lng: 234.00, alt: 80, speed: 10, accuracy: 5, time: 12345678},
                {lat: 123.00, lng: 234.00, alt: 80, speed: 10, accuracy: 5, time: 23456789}
            ]
        }
    ]
    ;

    res.json(out);
};

exports.listUserLocations = function(req, res) {
    var groupId = req.groupId;
    var userId = req.userId;

    var out = {
        name: "user1",
        locations: [
            {lat: 123.00, lng: 234.00, alt: 80, speed: 10, accuracy: 5, time: 12345678},
            {lat: 123.00, lng: 234.00, alt: 80, speed: 10, accuracy: 5, time: 23456789}
        ]
    };

    res.json(out);
};


