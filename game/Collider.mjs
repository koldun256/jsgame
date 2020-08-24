import CollisionListener from './CollisionListener'

const collisionAlgorithms = {
	'rect rect': (rect1, rect2) => {
		let a = false,
			b = false,
			c = false,
			d = false
		if (rect2.payload.position[0] > rect1.payload.position[0]) {
			b =
				rect2.payload.position[0] - rect2.payload.size[0] <
				rect1.payload.position[0] + rect1.payload.size[0]
		} else {
			a =
				rect2.payload.position[0] + rect2.payload.size[0] >
				rect1.payload.position[0] - rect1.payload.size[0]
		}
		if (rect2.payload.position[1] > rect1.payload.position[1]) {
			d =
				rect2.payload.position[1] - rect2.payload.size[1] <
				rect1.payload.position[1] + rect1.payload.size[1]
		} else {
			c =
				rect2.payload.position[1] + rect2.payload.size[1] >
				rect1.payload.position[1] - rect1.payload.size[1]
		}
		let result = (a || b) && (c || d)
		return result
	},
	'rect ring': (rect, ring) => {
		function calcDistance(pointA, pointB) {
			return Math.abs(
				Math.sqrt(
					(pointA[0] - pointB[0]) ** 2 +
						(pointA[1] - pointB[1]) ** 2
				)
			)
		}
		let distance = calcDistance(rect.position, ring.position)
		return (
			distance > ring.payload.radius / 2 - ring.payload.width / 2 &&
			distance < ring.payload.radius / 2 + ring.payload.width / 2
		)
	},
}

class Collider {
	constructor(owner, payload, shape, type, collisionSystem) {
		console.log(owner)
		this.payload = payload.add({ position: owner.position })
		this.shape = shape
		this.owner = owner
		this.type = type
		this.collisionSystem = collisionSystem

		collisionSystem.addCollider(this)
	}

	isTouching(other) {
		if (collisionAlgorithms[`${this.shape} ${other.shape}`]) {
			return collisionAlgorithms[`${this.shape} ${other.shape}`](
				this,
				other
			)
		} else if (collisionAlgorithms[`${other.shape} ${this.shape}`]) {
			return collisionAlgorithms[`${other.shape} ${this.shape}`](
				other,
				this
			)
		} else {
			throw new Error('unknown shapes ' + other.shape + ' ' + this.shape)
		}
	}

	onExit(type, callback) {
		new CollisionListener('exit', callback, this, type)
	}

	onEnter(type, callback) {
		new CollisionListener('enter', callback, this, type)
	}

	onStay(type, callback) {
		new CollisionListener('stay', callback, this, type)
	}
}

export default Collider
