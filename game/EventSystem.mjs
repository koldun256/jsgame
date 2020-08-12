export default function EventSystem() {
	let listeners = [];
	this.on = (event, callback) => listeners.push({ event, callback });
	this.emit = (event, data) =>
		listeners
			.filter(listener => listener.event == event)
			.forEach(listener => listener.callback(data));
};
