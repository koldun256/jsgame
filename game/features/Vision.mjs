import Collider from '../Collider.mjs'
export default {
	name: 'vision',
	requires: ['socket events'],
	init(viewportSize) {
		this.seeing = new Set()
		new Collider(
			this,
			{ size: viewportSize },
			'rect',
			'viewport',
			this.room.collisionSystem
		)
		this.on('see', collider => {
			if (this.seeing.has(collider.owner)) return
			if(collider.owner == this) return
			this.emit('socket@see', collider.owner.seeData(collider.owner == this))
			this.seeing.add(collider.owner)
		})
		this.room.eventSystem.on('change movement', object => {
			if (this.seeing.has(object) || object == this)
				this.emit('socket@change movement', {
					id: object.id,
					movement: object.movement.data(),
				})
		})
	},
}
