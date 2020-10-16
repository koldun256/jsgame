import Movement from '../Movement.mjs'
export default {
	name: 'moving',
	requires: ['event system'],
	init(speed) {
		this.movement = Movement.zero(this)
		this.on('target', target => {
			this.movement = new Movement(this, target, speed)
		})
		this.on('frame', () => {
			this.movement.move()
		})
	}
}
