import eventSystem from 'Other/eventSystem'
import io from 'socket.io-client'
const socket = io.connect('http://127.0.0.1:5000')
socket.onevent = ({ data }) => {
	console.log(...data);
	eventSystem.publish('socket@' + data[0], data[1])
}
eventSystem.subscribe(/^socket-emit@/, (data, event) => {
	socket.emit(event.slice(12, event.length), data)
})
