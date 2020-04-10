const Movement  = require('./Movement.js')
const Direction = require('./Direction.js')
const Collider  = require('./Collider.js')
const Room      = require('./Room.js')
function Player(socket, setting){
    this.position   = [0,0]
    this.movement   = Movement.zero()
    this.state      = 'active'
    this.viewport   = new Collider(this, setting.viewport, 'viewport')
    this.body       = new Collider(this, setting.playerSize, 'player')
    this.seeing     = new Set()
    socket.on('movement target', function(target){
        this.movement = new Movement(this, new Direction(this.position, target), setting.speed, true)
    })
    socket.on('room enter', function(msg){
        let room
        if(msg.room == 'random'){
            room = Room.getRandom()
        }
    })
    this.stop = function(){
        this.movement = Movement.zero()
    }
    this.see = function(object){
        this.send(object.data('see'))
        this.seeing.add(object)
    }
    this.addMana = function(mana){
        this.mana += mana
        if(this.mana >= setting.maxMana) this.mana = setting.maxMana
    }
    this.send = (event, message) => socket.emit(event, message)

}
