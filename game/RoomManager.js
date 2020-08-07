const Room = require('./Room')

class RoomManager {
	constructor(defaultMode){
		this.currentRandom = null
		this.defaultMode = defaultMode
		this.waiting = new Set()
	}
	random(){
		if(!this.currentRandom) {
			this.currentRandom = new Room(this.defaultMode)
		}
		return this.currentRandom
	}
	create(mode){
		let room = new Room(mode)
		this.waiting.add(room)
		room.events.on('start', () => this.waiting.delete(room))
	}
	get(id){
		if(!id) return this.random()
		return Array.from(this.waiting).find(room => room.id == id) || null
	}
}

module.exports = RoomManager
