import Collider from '../Collider.mjs';
export default {
	name: 'vision',
	requires: ['socket events'],
	init(viewportSize) {
		let seeing = new Set()
		new Collider(
			this,
			{ size: viewportSize },
			'rect',
			'viewport',
			this.room.collisionSystem
		)
		this.on('see', collider => {
			if (this.seeing.has(collider.owner)) return
			this.emit('socket@see', collider.owner.data(collider.owner == this))
			seeing.add(collider.owner)
		})
	},
}
