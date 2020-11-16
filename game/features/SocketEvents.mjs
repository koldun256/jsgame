export default {
	name: 'socket events',
	requires: ['event system'],
	init(socket){
		this.on(/^socket@/, (data, topic) => {
			socket.emit(topic.match(/^socket@(.*)/)[1], data)
		})
		socket.onevent = ({data}) => {
			console.log('message from socket ',data)
			this.emit(data[0], data[1])
		}
		this.send = (event, data) => this.emit('socket@'+event, data)
	}
}
