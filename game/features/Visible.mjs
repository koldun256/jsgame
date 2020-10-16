export default {
	name: 'visible',
	requires: ['basic collider'],
	init(visibleOnStart = false) {
		if (visibleOnStart) {
			this.room.gameObjects
				.filter(gameObject => gameObject.mixins.has('vision'))
				.forEach(gameObject => gameObject.emit('see', this.collider))
			return
		}
		this.collider.onEnter('viewport', collider => {
			collider.owner.emit('see', this.collider)
		})
		this.data = (protagonist = false) => ({
			...this.collider.payload,
			id: this.id,
			movement: this.movement ? this.movement.data() : null,
			display: this.collider.shape,
			protagonist: protagonist,
			color: !protagonist
				? this.room.settings.colors[this.type]
				: this.room.settings.colors.protagonist,
		})
	},
}
