import GameObject from './GameObject.mjs'
class ManaZone extends GameObject {
	constructor(room, position) {
		console.log('creating mana zone')
		super(room, 'manaZone', position, {
			shape: 'ring',
			payload: {
				radius: room.settings['mana zone distance'],
				width: room.settings['mana zone width'],
				size: [
					room.settings['mana zone distance'],
					room.settings['mana zone distance'],
				],
			},
		})
		room.manaZones.push(this)
	}
}
export default ManaZone
