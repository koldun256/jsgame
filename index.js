const path = require('path');
const express = require('express');
const app = express();
const http = require('http').createServer(app);

const io = require('socket.io')(http)
const favicon = require('serve-favicon')
const randomColor = require('randomcolor')
const game = require('./game/Main')

const PORT = process.env.PORT || 5000;

app.use(express.static('public'));

app.get('/', (req, res) => res.sendFile(__dirname + '/index.html'));

io.on('connection', socket => game.createUser(socket))
http.listen(PORT, ()=>console.log(`listening on port ${PORT}`));
