import WithFeatures from './WithFeatures.mjs'
import BasicCollider from './features/BasicCollider.mjs'
import EventSystem from './features/EventSystem.mjs'
import SocketEvents from './features/SocketEvents.mjs'
import Vision from './features/Vision.mjs'
import Visible from './features/Visible.mjs';
import Mana from './features/Mana.mjs'
import Moving from './features/Moving.mjs'
import * as util from './util.mjs'

class Player extends WithFeatures {
	constructor(socket, name, room, team) {
		super()

		this.name = name
		this.room = room
		this.team = team
		this.id = util.generateID()
		this.position = [...team.position]
		this.type = 'Player'

		team.add(this)

		this.add(EventSystem, room.eventSystem)
		this.add(SocketEvents, socket)
		this.add(BasicCollider, { size: room.settings['player size'] }, 'rect')
		this.add(Vision, room.settings['viewport'])
		this.add(Mana, room.settings['start mana'], room.settings['max mana'])
		this.add(Moving, room.settings['player speed'])
		this.add(Visible)

		room.registrate(this)
	}

	connectingData() {
		return {
			id: this.id,
			team: this.team.id,
			name: this.name,
		}
	}
}

export default Player
