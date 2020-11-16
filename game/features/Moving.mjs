import Movement from '../Movement.mjs'
export default {
	name: 'moving',
	requires: ['event system'],
	init(speed) {
		this.movement = Movement.zero(this)
		this.on('movement target', target => {
			console.log('movement change')
			this.movement = new Movement(this, target, speed)
			this.room.eventSystem.emit('change movement', this)
		})
	this.stop = () => {
		console.log('stopped')
		this.movement = Movement.zero(this)
		this.room.eventSystem.emit('change movement', this)
	}
		this.on('update', () => {
			this.movement.move()
		})
	}
}
