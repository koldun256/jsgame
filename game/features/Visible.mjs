export default {
	name: 'visible',
	requires: ['basic collider'],
	init(visibleOnStart = false) {
		this.collider.onEnter('viewport', collider => {
			collider.owner.emit('see', this.collider)
		})
		this.seeData = (protagonist = false) => ({
			...this.collider.payload,
			id: this.id,
			movement: this.movement ? this.movement.data() : null,
			display: this.collider.shape,
			protagonist: protagonist,
			color: protagonist
				? this.room.settings.colors.protagonist
				: this.room.settings.colors[this.type]
		})
		if (visibleOnStart) {
			this.room.gameObjects
				.filter(gameObject => gameObject.features.has('vision'))
				.forEach(gameObject => gameObject.emit('see', this.collider))
			return
		}
	},
}
