import GameObject from './GameObject.mjs'
import ManaZone from './ManaZone'

class Team extends GameObject {
	constructor(room, position){
		let size = room.settings['base size']
		super(room, 'base', position, {shape: 'rect', payload: {size}})
		this.playersCount = room.settings['players in team']
		this.pointsToWin = room.settings['points to win']

		this.players = []
		this.points = 0
		this.manaZone = new ManaZone(room, position)
	}

	full(){
		return this.players.length == this.playersCount
	}

	addPoints(points){
		this.points += points
		if(this.points >= this.pointsToWin) this.room.end(this.id)
	}

	add(player) {
		if(this.players.length <= this.playersCount){
			this.players.push(player)
		}
	}

}
export default Team
