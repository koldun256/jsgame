const util = require('./util.js')

let eventListeners = {}
let Main = {}
Main.on = (event, listener) => {
    if(!(event in eventListeners)) eventListeners[event] = []
    eventListeners[event].push(listener)
}
Main.broadcast = (event, ...args) => {
    if(event in eventListeners) eventListeners[event].forEach(listener => listener(...args))
}
