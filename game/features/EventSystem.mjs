import EventSystem from '../EventSystem.mjs'

export default {
	name: 'event system',
	requires: [],
	init(parent){
		let eventSystem = new EventSystem(parent)
		this.emit = (event, data) => eventSystem.emit(event, data)
		this.on = (event, callback) => eventSystem.on(event, callback)
		//eventSystem.on(/.*/, (_, event) => console.log(event))
	}
}
