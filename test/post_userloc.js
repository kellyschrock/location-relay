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

function postLocation(request, hostname, hostport) {
    var post_options = {
        host: hostname || 'localhost',
        port: hostport || 3000,
        path: '/follow/user',
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
        heading: 15,
        time: new Date().getTime()
    };

    var body = {
        groupId: group,
        userId: user,
        location: loc
    };

    return JSON.stringify(body);
}

function processLines(lines, groupId, userId, host, port) {
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
            postLocation(req, host, port);
        }, time, requests[i]);

        time += 2000;
    }
}


function main(argv) {
    var filename = "";
    var groupId = "";
    var userId = "";
    var host = "";
    var port = "";

    for(var i = 0; i < argv.length; ++i) {
        var arg = argv[i];

        if(arg.indexOf("--input") >= 0) filename = arg.substring("--input=".length);
        if(arg.indexOf("--group") >= 0) groupId = arg.substring("--group=".length);
        if(arg.indexOf("--user") >= 0) userId = arg.substring("--user=".length);
        if(arg.indexOf("--host") >= 0) host = arg.substring("--host=".length);
        if(arg.indexOf("--port") >= 0) port = parseInt(arg.substring("--port=".length));
    }

    var required = [filename, groupId, userId];
    for(var i = 0; i < required.length; ++i) {
        console.log("arg=" + required[i]);
        if(required[i] === "") {
            showHelp();
            return;
        }
    }

    doReadFile(filename, function(data) {
        var lines = data.split("\n");
        processLines(lines, groupId, userId, host, port);
    });
}

function showHelp() {
    console.log("Usage: " + process.argv[1] + " --input=[filename] --group=groupId --user=userId [--host=hostname] [--port=port]");
}


if(process.argv.length >= 5) {
    main(process.argv.splice(2));
}
else {
    showHelp();
}

