var app = require('express')();
var http = require('http').createServer(app);
var io = require('socket.io')(http);
var game = require("./game");

app.get('/', function(req, res){
  res.sendFile(__dirname + '/index.html');
});

io.on('connection', function(socket){
	let user = game.addUser(socket.id,(a,b)=>socket.emit(a,b));
	socket.emit("setsize",{height: game.height,width: game.width});
    socket.on("moved",function(key){
		if("game" in user)
			game.move(socket.id,key.key);
	});
	socket.on("started",function(){
		game.addUserToGame(user,(player1,player2)=>{
			 setInterval(()=>{
				player2.send("update",{players: [player1.toSendingData(),player2.toSendingData()]});
			 	socket.emit("update",{players: [player1.toSendingData(),player2.toSendingData()]});
			 },100);
		});
	});
	
    socket.on('disconnect',function(){
        delete game.getUsers[socket.id];
    });
});

http.listen(21, function(){
  console.log('listening on *:3000');
});
