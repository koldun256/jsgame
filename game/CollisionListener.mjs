class CollisionListener {
	constructor(eventType, exec, collider, targetType) {
		this.eventType = eventType
		this.exec = exec
		this.collider = collider
		this.targetType = targetType
		this.touching = new Set()
		this.collisionSystem = collider.collisionSystem

		this.collisionSystem.addListener(this)
	}

	update(colliders) {
		colliders[this.targetType]
			.filter(collider => collider != this.collider)
			.forEach(collider => this.checkOne(collider))
	}

	checkOne(collider) {
		let isTouching = this.collider.isTouching(collider)
		let wasTouching = this.touching.has(collider)
		//console.log(
			//`(${this.collider.type}@${this.collider.owner.id} with ${collider.type}@${collider.owner.id}): isTouching: ${isTouching}, wasTouching: ${wasTouching}, type: ${this.eventType}`
		//)
		if (!isTouching) this.touching.delete(collider)
		if (isTouching) this.touching.add(collider)

		if (
			(this.eventType == 'stay' && isTouching) ||
			(this.eventType == 'enter' && isTouching && !wasTouching) ||
			(this.eventType == 'exit' && !isTouching && wasTouching)
		)
			this.exec(collider)
	}
}

export default CollisionListener
