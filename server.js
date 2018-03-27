var express = require('express');
var bodyParser = require('body-parser');
var _ = require('lodash');
var app = express();
var path = require("path");

let users = [
    {"name":"qweqwe","surname":"awdawd","age":1},
    {"name":"qweqwe","surname":"awdawd","age":2},
    {"name":"qweqwe","surname":"awdawd","age":3},
    {"name":"qweqwe","surname":"awdawd","age":4},
    {"name":"qweqwe","surname":"awdawd","age":5},
    {"name":"qweqwe","surname":"awdawd","age":6},
    {"name":"qweqwe","surname":"awdawd","age":7},
    {"name":"qweqwe","surname":"awdawd","age":8},
    {"name":"qweqwe","surname":"awdawd","age":9},
    {"name":"qweqwe","surname":"awdawd","age":10},
    {"name":"qweqwe","surname":"awdawd","age":11},
    {"name":"qweqwe","surname":"awdawd","age":12}
    ];

let paginUsers = _.chunk(users, 5);

app.use('/', express.static(path.join(__dirname, '/dist/')));
app.use(bodyParser.json());

app.get('/',function(req,res){
    res.sendFile(__dirname + '/dist/index.html');
});

app.get('/usersCounter', function (req, res){
    res.send(JSON.stringify(users.length));
})

app.post('/addUser', function(req, res){
    users.push(req.body);
    res.send(users.map(function(x){
        return {
            name: x.name,
            surname: x.surname,
            age: x.age,
        };
    }));
})

app.get('/getUsers?', function(req,res){
    let query = req.query;
    console.log('query.firstSemafor: ', query.firstSemafor, 'query.secondSemafor: ', query.secondSemafor - 1);
    console.log(' cokolwiek: ',users.slice(query.firstSemafor, query.secondSemafor));
    res.send(users.slice(query.firstSemafor, query.secondSemafor).map(function(x){
        return {
            name: x.name,
            surname: x.surname,
            age: x.age,
        };
    }));
})

var server = app.listen(8081, function () {
    var host = server.address().address;
    var port = server.address().port;
    console.log("Example app listening at http://%s:%s", host, port);
})