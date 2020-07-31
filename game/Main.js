const util = require('./util.js')
const User = require('./User.js')

let eventListeners = {}
module.exports.on = (event, listener) => {
    if(!(event in eventListeners)) eventListeners[event] = []
    eventListeners[event].push(listener)
}
module.exports.broadcast = (event, ...args) => {
    if(event in eventListeners) eventListeners[event].forEach(listener => listener(...args))
}
setInterval(() => module.exports.broadcast('update'), 100)
module.exports.createUser = socket => new User(socket)
