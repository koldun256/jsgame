import * as util from './util.mjs'
import EventSystem from './EventSystem.mjs'
import RoomManager from './RoomManager.mjs'

export const eventSystem = new EventSystem()
export const roomManager = new RoomManager('DM')

setInterval(() => eventSystem.emit('update'), 100)
