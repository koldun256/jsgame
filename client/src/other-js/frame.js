import eventSystem from 'Other/eventSystem';
const frameDelay = 100

setInterval(() => eventSystem.publish('frame', null) , frameDelay)
