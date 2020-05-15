const util = require('./util.js')
const User = require('./User')

let eventListeners = {}
module.exports.on = (event, listener) => {
    if(!(event in eventListeners)) eventListeners[event] = []
    eventListeners[event].push(listener)
}
module.exports.broadcast = (event, ...args) => {
    if(event in eventListeners) eventListeners[event].forEach(listener => listener(...args))
}
module.exports.createUser = socket => new User(socket)
