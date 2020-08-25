import Vector from './Vector.mjs'

class Movement {
	constructor(owner, target, speed, hasEnd = true) {
		this.hasEnd = hasEnd
		this.speed = speed
		this.owner = owner
		this.target = target
		this.vector = new Vector([...owner.position], target)
	}
	move() {
		let delta = this.vector.getStep(this.speed)
		this.owner.position[0] += delta[0]
		this.owner.position[1] += delta[1]
		if (this.hasEnd && !this.vector.inEdges(this.owner.position)) {
			this.owner.stop()
		}
	}
	data() {
		return {
			step: this.vector.getStep(this.speed),
			end: this.hasEnd ? this.target : null,
		}
	}
	static zero(owner) {
		return new Movement(owner, owner.position, 0, false)
	}
}

export default Movement
