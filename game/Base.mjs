import WithFeatures from './WithFeatures.mjs'
import BasicCollider from './features/BasicCollider.mjs'
import Visible from './features/Visible.mjs'
import {generateID} from './util.mjs';

class Base extends WithFeatures {
	constructor(room, position){
		super()

		room.registrate(this)

		this.room = room
		this.position = position
		this.type = 'Base'
		this.id = generateID()

		this.add(BasicCollider, {size: this.room.settings['base size']}, 'rect')
		this.add(Visible)
	}
}

export default Base
