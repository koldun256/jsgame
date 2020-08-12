import * as util from './util.mjs'
import EventSystem from './EventSystem'
import RoomManager from './RoomManager'

export const eventSystem = new EventSystem()
export const roomManager = new RoomManager('DM')

setInterval(() => eventSystem.emit('update'), 100)
