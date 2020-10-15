import * as util from './util.mjs'
import Movement from './Movement.mjs'
import Collider from './Collider.mjs'

class GameObject {
	constructor(room, type, position, colliderData, speed) {
		this.id = util.generateID()
		this.room = room
		this.type = type
		this.position = position
		this.collider = new Collider(
			this,
			colliderData.payload.add({position}),
			colliderData.shape,
			type,
			room.collisionSystem
		)
		room.gameObjects.push(this)

		if (speed) {
			this.speed = speed
			this.movement = Movement.zero(this)
		}
	}

	data(situation, detail={protagonist:false}) {
		switch (situation) {
			case 'see':
				return {
					...this.collider.payload,
					id: this.id,
					movement: this.movement ? this.movement.data() : null,
					display: this.collider.shape,
					protagonist: detail.protagonist,
					color: !detail.protagonist ? this.room.settings.colors[this.type] : this.room.settings.colors.protagonist
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
		console.log('set target' , target)
		if (!this.movement) throw 'changing movement target of static object'
		this.setMovement(new Movement(this, target, this.speed))
	}
}

export default GameObject
