import EventSystem from '../EventSystem.mjs'

export default {
	name: 'event system',
	init(parent){
		let eventSystem = new EventSystem(parent)
		this.emit = eventSystem.emit
		this.on = eventSystem.on
		if(frames) setInterval(() => eventSystem.emit('frame'), 100)
	}
}
