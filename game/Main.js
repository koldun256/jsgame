require('./util.js')
const EventSystem = require('./EventSystem')
const RoomManager = require('./RoomManager')

let eventSystem = new EventSystem()
let roomManager = new RoomManager('DM')

setInterval(() => eventSystem.emit('update'), 100)

module.exports.eventSystem = eventSystem
module.exports.roomManager = roomManager
console.log(module.exports)
