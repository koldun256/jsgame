export default class EventSystem {
	constructor(parent) {
		this.listeners = new Set()
		if(parent) parent.on(/.*/, (data, event) => {
			this.emit(event,data)
		})
	}
	on(toWhat, exec) {
		let check
		if(typeof toWhat == 'string') check = event => event == toWhat
		if(toWhat instanceof RegExp) check = event => toWhat.test(event)
		if(typeof toWhat == 'function') check = toWhat
		let listener = {check, exec}
		this.listeners.add(listener)
		return () => this.listeners.delete(listener)
	}
	emit(event, data){
		//console.log('emitting',event);
		[...this.listeners]
			.filter(listener => listener.check(event))
			.forEach(listener => listener.exec(data, event))
	}
}
