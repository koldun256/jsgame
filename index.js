const path = require('path');
const express = require('express');
const app = express();
const http = require('http').createServer(app);

const io = require('socket.io')(http);
const favicon = require('serve-favicon');
const randomColor = require('randomcolor');
const game = require('./game');

const PORT = process.env.PORT || 5000;

app.use(express.static('public'));
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));

app.get('/', (req, res) => res.sendFile(__dirname + '/index.html'));
io.on('connection', socket => {
	let user = game.addUser(socket.id, (a,b)=>socket.emit(a,b), randomColor());

	socket.emit('setup', {
        height: game.height,
        width: game.width,
        speed: game.speed,
        fieldHeight: game.fieldHeight,
        fieldWidth: game.fieldWidth,
        baseSize: game.baseSize});

    socket.on('setTarget', target=>{
		if(user.state == 'active') user.createMovement(target)
	});

	socket.on('started',msg=>game.addUserToGame(user,msg.spells));

    socket.on('disconnect',function(){
        console.log('deleted');
        delete game.getUsers()[socket.id];
	});

	socket.on('spell', function(msg){
		if(user.state == 'active'){
			user.cast(msg);
		}
	});
});

http.listen(PORT, ()=>console.log(`listening on port ${PORT}`));
