const util = require('./util.js')
const User = require('./User')

let eventListeners = {}
let Main = {}
Main.on = (event, listener) => {
    if(!(event in eventListeners)) eventListeners[event] = []
    eventListeners[event].push(listener)
}
Main.broadcast = (event, ...args) => {
    if(event in eventListeners) eventListeners[event].forEach(listener => listener(...args))
}
Main.createUser = socket => new User(socket)

module.exports = Main
