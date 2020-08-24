const listeners = new Set()
export default {
	subscribe(toWhat, exec) {
		let check
		if(typeof toWhat == 'string') check = event => event == toWhat
		if(toWhat instanceof RegExp) check = event => toWhat.test(event)
		if(typeof toWhat == 'function') check = toWhat
		let listener = {check, exec}
		listeners.add(listener)
		return () => listeners.delete(listener)
	},
	publish(event, data) {
		[...listeners]
			.filter(listener => listener.check(event))
			.forEach(listener => listener.exec(data, event))
	},
}
