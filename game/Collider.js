let colliders = {};
let listeners = [];
function Collider(owner, size, type){
    this.size       = [...size]
    this.position   = owner.position
    this.owner      = owner
    this.type       = type
    this.id         = Symbol()
    this.isTouching = function(other){
        let a=false,b=false,c=false,d = false;
        if(other.position[0] > this.position[0]){
            b = (other.position[0]-other.size[0]) < (this.position[0]+this.size[0]);
        }else{
            a = (other.position[0]+other.size[0]) > (this.position[0]-this.size[0]);
        }
        if(other.position[1] > this.position[1]){
            d = (other.position[1]-other.size[1]) < (this.position[1]+this.size[1]);
        }else {
            c = (other.position[1]+other.size[1]) > (this.position[1]-this.size[1]);
        }
        let result = (a||b)&&(c||d);
        return result;
    }
    this.onExit     = (type, callback) => listeners.push({  targetType: type,
                                                            callback: callback,
                                                            collider: this,
                                                            eventType: 'exit',
                                                            currentlyEntered: new Set()})

    this.onStay     = (type, callback) => listeners.push({  targetType: type,
                                                            callback: callback,
                                                            collider: this,
                                                            eventType: 'stay',
                                                            currentlyEntered: new Set()})

    this.onTouch    = (type, callback) => listeners.push({  targetType: type,
                                                            callback: callback,
                                                            collider: this,
                                                            eventType: 'enter',
                                                            currentlyEntered: new Set()})

    if(!(type in colliders)) colliders[type] = []
    colliders[type].push(this)
}
Collider.update = function(){
    for(let listener of listeners){
        for(let collider of colliders[listener.targetType]){
            if( collider.id != listener.collider.id &&
                collider.owner.room.id == listener.collider.owner.room.id) {
                if(collider.isTouching(listener.collider)){
                    if(listener.eventType == 'enter'){
                        if(!listener.currentlyEntered.has(collider.id)) listener.callback(collider.owner)
                    }
                    if(listener.eventType == 'stay') listener.callback(collider.owner)
                    listener.currentlyEntered.add(collider.id)
                }else {
                    if(listener.eventType == 'exit' && listener.currentlyEntered.has(collider.id)) listener.callback(collider.owner)
                    listener.currentlyEntered.delete(collider.id)
                }

            }
        }
    }
}
Collider.generateManaZones = function(basePositions, distance, width, room){
    basePositions.forEach(basePosition => {
        let zone = new Collider({position: basePosition, room: room}, [0,0], 'mana zone')
        zone.isTouching = other => {
            function calcDistance(pointA,pointB){
                return Math.abs(Math.sqrt((pointA[0]-pointB[0])**2 + (pointA[1]-pointB[1])**2))
            }
            let playerDistance = calcDistance(other.position, basePosition)
            return (playerDistance > (distance/2 - width/2)) && (playerDistance < (distance/2 + width/2))
        }
    })
}
module.exports = Collider;
