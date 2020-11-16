class CollisionSystem {
	constructor() {
		this.colliders = { all: [] }
		this.listeners = []
	}
	addCollider(collider) {
		console.log(collider);
		if (!(collider.type in this.colliders)) {
			this.colliders[collider.type] = []
		}
		console.log('adding collider ', collider.type)
		this.colliders[collider.type].push(collider)
		this.colliders.all.push(collider)
		return collider
	}
	update() {
		//console.log('UPDATING COLLISION SYSTEM===============================');
		//console.log(this.colliders);
		this.listeners.forEach(listener => listener.update(this.colliders))
	}
	addListener(listener) {
		this.listeners.push(listener)
	}
}

export default CollisionSystem
