class CollisionSystem {
	constructor() {
		this.colliders = { all: [] }
		this.listeners = []
	}
	addCollider(collider) {
		if (!(collider.type in this.colliders)) {
			this.colliders[collider.type] = []
		}
		console.log(this.colliders)
		console.log(collider)
		this.colliders[collider.type].push(collider)
		this.colliders.all.push(collider)
		return collider
	}
	update() {
		this.listeners.forEach((listener) => listener.update(this.colliders))
	}
	addListener(listener) {
		this.listeners.push(listener)
	}
}

export default CollisionSystem
