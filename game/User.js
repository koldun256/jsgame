const Player = require('./Player')
const Main = require('./Main')

function User(socket){
	this.createPlayer = function(name, room, team, spellsData){
		return new Player(socket, name, room, team, spellsData)
	}
	socket.on('request room enter', data => {
        try {
            let room = Main.roomManager.get(data.roomID)
            room.addPlayer(this, data.name, data.spells, data.team)
        }catch(e) {
            console.log(e.stack)
        }
    })
}

module.exports = User
