#!/usr/bin/env node

var fs = require('fs');
var http = require('http');

function doReadFile(filename, callback) {
    fs.readFile(filename, 'utf-8', function(err, data) {
        if(err) {
            console.log(err);
        }
        else {
            callback(data);
        }
    });
}

function postLocation(request) {
    var post_options = {
        host: 'localhost',
        path: '/follow/user',
        port: 3000,
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Content-Length': Buffer.byteLength(request)
        }
    };

    var callback = function(res) {
        var str = "";

        res.on('data', function(chunk) {
            // console.log("chunk=" + chunk);
            str += chunk;
        });

        res.on('end', function() {
            // console.log("done");
        });

        res.on('error', function(err) {
            console.log("ERROR: " + err);
        })
    };

    var req = http.request(post_options, callback);

    // console.log("post " + request);
    req.write(request);
    req.end();
}

function toRequestBody(line, group, user) {

    var ll = line.split(",");
    var loc = {
        lat: parseFloat(ll[0]),
        lng: parseFloat(ll[1]),
        altitude: 30,
        speed: 5,
        accuracy: 5,
        time: new Date().getTime()
    };

    var body = {
        groupId: group,
        userId: user,
        location: loc
    };

    return JSON.stringify(body);
}

function processLines(lines, groupId, userId, eternal) {
    var requests = [];
    var i;

    for(i = 0; i < lines.length; ++i) {
        if("" !== lines[i]) {
            requests.push(toRequestBody(lines[i], groupId, userId));
        }
    }

    var time = 0;
    for(i = 0; i < requests.length; ++i) {
        setTimeout(function(req) {
            postLocation(req);
        }, time, requests[i]);

        time += 3000;
    }
}


function main(argv) {
    var filename = argv[0];
    var groupId = argv[1];
    var userId = argv[2];
    var eternal = argv.length > 3;

    doReadFile(filename, function(data) {
        var lines = data.split("\n");
        processLines(lines, groupId, userId, eternal);
    });
}


if(process.argv.length >= 5) {
    main(process.argv.splice(2));
}
else {
    console.log("Usage: " + process.argv[1] + " [filename] groupId userId");
}


function get_test() {
    var options = {
      host: 'www.google.com',
      path: '/',
      port: 80
    };

    callback = function(response) {
      var str = ''
      response.on('data', function (chunk) {
        str += chunk;
      });

      response.on('end', function () {
        console.log(str);
      });
    }

    var req = http.request(options, callback);
    req.end();
}
