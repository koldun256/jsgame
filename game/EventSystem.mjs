export default class EventSystem {
	constructor() {
		this.listeners = []
	}
	on(event, callback) {
		this.listeners.push({ event, callback })
	}
	emit(event, data){
		this.listeners
			.filter(listener => listener.event == event)
			.forEach(listener => listener.callback(data))
	}
}
