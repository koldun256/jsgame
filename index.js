(async () => {
	const express = require('express');
	const app = express();
	const http = require('http').createServer(app);
	
	const io = require('socket.io')(http)
	const User = await import('./game/User.mjs')
	const PORT = process.env.PORT || 5000;
	
	app.use(express.static('public'));
	
	app.get('/', (req, res) => res.sendFile(__dirname + '/index.html'));
	
	io.on('connection', socket => new User.default(socket))
	http.listen(PORT, ()=>console.log(`listening on port ${PORT}`));
})()
