import * as util from './util.mjs'
import Movement from './Movement.mjs'
import Collider from './Collider.mjs'

class GameObject {
	constructor(room, type, position, size, speed) {
		this.id = util.generateID()
		this.room = room
		this.type = type
		this.position = position
		this.collider = new Collider(this, size, type, room.collisionSystem)

		if (speed) {
			this.speed = speed
			this.movement = Movement.zero(this)
		}
	}

	data(situation) {
		console.log('something')
		switch (situation) {
			case 'know':
				return {
					id: this.id,
					type: this.type,
				}
			case 'see':
				return {
					id: this.id,
					position: this.position,
					movement: this.movement ? this.movement.data() : null,
				}
		}
	}

	move() {
		if (!this.movement) throw 'moving static object'
		this.movement.move()
	}

	setMovement(movement) {
		if (!this.movement) throw 'changing movement of static object'
		this.movement = movement
		this.room.eventSystem.emit('change movement', this)
	}

	stop() {
		console.log('stop')
		this.setMovement(Movement.zero(this))
	}

	teleport(position) {
		this.stop()
		this.position = position
	}

	setTarget(target) {
		console.log('set target')
		if (!this.movement) throw 'changing movement target of static object'
		this.setMovement(new Movement(this, target, this.speed))
	}
}
export default GameObject
