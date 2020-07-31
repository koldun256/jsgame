const util = require('./util')
const Player = require('./Player')
const Spell = require('./Spell')
const Room = require('./Room')
const setting = require('./setting.json')

function User(socket){
	this.createPlayer = function(name, room, team, spellsData){
		return new Player(socket, name, room, team, spellsData)
	}
	socket.on('request room enter', data => {
        try {
            let room = Room.random()
            room.addPlayer(this, data.name, data.spells, data.team)
        }catch(e) {
            console.log(e.stack)
        }

    })
}

module.exports = User
