import BasicCollider from './features/BasicCollider.mjs';
import ManaGiving from './features/ManaGiving.mjs';
import Visible from './features/Visible.mjs';
import WithFeatures from './WithFeatures.mjs';

class ManaZone extends WithFeatures {
	constructor(room, position) {
		super()

		this.room = room
		this.position = position
		this.type = 'ManaZone'

		this.add(BasicCollider, {
			radius: room.settings['mana zone distance'],
			width: room.settings['mana zone width'],
			size: [
				room.settings['mana zone distance'] * 2,
				room.settings['mana zone distance'] * 2,
			],
		}, 'ring')
		this.add(ManaGiving, room.settings['mana regen'])
		this.add(Visible, true)

		room.registrate(this)
	}
}

export default ManaZone
