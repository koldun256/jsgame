import Player from './Player.mjs'
import * as Main from './Main.mjs'
import { SpellSet } from './Spell.mjs'

class User {
	createPlayer(name, room, team, spellsData){
		return new Player(socket, name, room, team, spellsData)
	}
	constructor(socket){
		this.spellSet = new SpellSet(socket)
		socket.on('request room enter', data => {
			try {
				let room = Main.roomManager.get(data.roomID)
				room.addPlayer(this, data.name, data.spells, data.team)
			}catch(e) {
				console.log(e.stack)
			}
		})
		socket.on('add spell', data => this.spellSet.add(data))
	}
}

export default User
