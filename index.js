var app = require('express')();
var http = require('http').createServer(app);
var io = require('socket.io')(http);
var game = require("./game")();

app.get('/', function(req, res){
  res.sendFile(__dirname + '/index.html');
});

io.on('connection', function(socket){
    game.addUser(socket.id);
    socket.emit("setsize",{height: game.height,width: game.width});
    socket.on("moved",function(key){
        game.move(socket.id,key.key);
    });
    socket.on('disconnect',function(){
        delete game.getUsers[socket.id];
    });
});
setInterval(()=>{
    io.emit("update",{players: game.getUsers()});
},100);
http.listen(3000, function(){
  console.log('listening on *:3000');
});
