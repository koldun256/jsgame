const GameObject = require('./GameObject.js')
function Team(room, position){
	let size = room.settings['base size']
	let playersCount = room.settings['players in team']
	let pointsToWin = room.settings['points to win']

    this.__proto__ = new GameObject(room, 'base', position, size)
    this.players = []
    this.points = 0

    this.full = function(){
		return this.players.length == playersCount
	}

    this.addPoints = function(points){
        this.points += points
        if(this.points >= pointsToWin) room.end(this.id)
    }

    this.add = function(player) {
        if(this.players.length <= playersCount){
            this.players.push(player)
        }
    }
}
module.exports = Team
