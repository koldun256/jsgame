let path = require("path");
let express = require("express");
let favicon = require("serve-favicon");
var app = express();
var http = require('http').createServer(app);
var io = require('socket.io')(http);
var game = require("./game");
var randomColor = require("randomcolor");
let dir = path.join(__dirname,'graphic');
app.use(express.static(dir));
app.use(favicon(__dirname+"/i.ico"));
app.get('/', function(req, res){
  res.sendFile(__dirname + '/index.html');
});
app.get('/graphic/bg.png',function(req,res){
	res.sendFile(__dirname+"/graphic/bg.png");
});

app.get('/graphic/spells/text.png',function(req,res){
	res.sendFile(__dirname+"/graphic/spells/text.png");
});
io.on('connection', function(socket){
	let user = game.addUser(socket.id,function(a,b){socket.emit(a,b);},randomColor());
	socket.emit("setsize",{height: game.height,width: game.width,speed: game.speed,fieldHeight: game.fieldHeight,fieldWidth: game.fieldWidth, baseSize: game.baseSize});
    socket.on("setTarget",function(target){
		if(user.state = "active"){
			user.createMovement(target);
		}
	});
	socket.on("started",function(msg){
		game.addUserToGame(user,msg.spells);
	});
    socket.on("disconnect",function(){
        console.log("deleted");
        delete game.getUsers()[socket.id];
	});
	socket.on("spell",function(msg){
		user.cast(msg);
	});
});

http.listen(process.env.PORT || 5000, function(){
  console.log('listening on *:3000');
});
