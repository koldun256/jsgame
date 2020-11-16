export default {
	name: 'mana',
	requires: ['basic collider', 'socket events'],
	init(start, max){
		let mana = start
		let adding = 0
		this.startMana = amount => {
			this.emit('socket@mana start')
			adding = amount
		}
		this.endMana = () => {
			this.emit('socket@mana end')
			adding = 0
		}
		this.on('frame', () => {
			mana += adding
			if(adding > max) mana = max
		})
	}
}
