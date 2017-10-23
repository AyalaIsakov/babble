var express = require('express'),
    http = require('http'),
    url = require('url'),
    fs = require('fs'),
    path = require('path'),
    app = express(),
    m = require('./message'),
    mu = require('./messages-util');
app.use(express.static(__dirname));

var messages = new mu.Messages();
var users = 0;
var clients = [];


var server = http.createServer();
server.on('request', function (request, response) {
    var filePath = request.url;
    if (filePath == '/'){
        filePath = 'index.html';
    }
    else if (filePath.startsWith('/poll')){
        poll(response, filePath);
    }
    else if (filePath.startsWith('/send/')){
        recieveMessage(response, filePath);
    }
    else if (filePath.startsWith('/stats')){
        updateStats(response);
    }
    else if (filePath.startsWith('/delete/')){
        deleteMessage(response, filePath);
    }

    var extname = path.extname(filePath);
    var contentType = 'text/html';
    switch (extname) {
        case '.js':
            contentType = 'text/javascript';
            break;
        case '.css':
            contentType = 'text/css';
            break;
        case '.json':
            contentType = 'application/json';
            break;
        case '.png':
            contentType = 'image/png';
            break;      
        case '.jpg':
            contentType = 'image/jpg';
            break;
    }
    fs.readFile('./client/' + filePath, function(error, content) {
        if (error) {
            if(error.code == 'ENOENT'){
                fs.readFile('./404.html', function(error, content) {
                    response.end(content, 'utf-8');
                });
            }
            else {
                response.writeHead(500);
                response.end('Sorry, check with the site admin for error: ' + error.code + ' ..\n');
                response.end();
            }
        }
        else {
            response.writeHead(200, { 'Content-Type': contentType });
            response.end(content, 'utf-8');
        }
    });

});

server.listen(9000);

// Console will print the message
console.log('start');
console.log('Server running at http://127.0.0.1:9000/');


function recieveMessage(res, reqPath){
    var msg_parts = unescape(reqPath.substr(6)).split('|||||');
    var msg = new m.Message(msg_parts[0], msg_parts[1], msg_parts[2]);
    messages.addMessage(msg);
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Access-Control-Allow-Methods", 'GET, POST, DELETE, OPTIONS');
    return res.end();
}

function poll(res, reqPath){
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Access-Control-Allow-Methods", 'GET, POST, DELETE, OPTIONS');
    var msg_number = Number(reqPath.replace(/[^0-9]*/, ''));
    if(messages.amount() > msg_number) {
        var msg = messages.getMessages()[msg_number];
        res.end(JSON.stringify({
            users: String(users),
            count: messages.amount(),
            message: msg.content,
            sender: msg.sender,
            sender_mail: msg.mail
        }));
    }
    else {
        clients.push(res);
    }
}

function updateStats(res){
    users += 1;
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.end(JSON.stringify({
        counter: String(users)
    }));
}

function deleteMessage(res, path){
    var msg_number = Number(reqPath.replace(/[^0-9]*/, ''));
    messages.splice(msg_number, 1);
    res.end(JSON.stringify({
        number: String(msg_number)
    }));
}