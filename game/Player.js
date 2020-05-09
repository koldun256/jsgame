const Movement  = require('./Movement.js')
const Direction = require('./Direction.js')
const Collider  = require('./Collider.js')
const Room      = require('./Room.js')
function Player(socket, setting){
    this.position   = [0,0]
    this.movement   = Movement.zero()
    this.state      = 'waiting'
    this.viewport   = new Collider(this, setting.viewport, 'viewport')
    this.body       = new Collider(this, setting.size, 'player')
    this.seeing     = new Set()
    this.id         = setting.id
    socket.on('movement target', function(target){
        this.movement = new Movement(this, new Direction(this.position, target), setting.speed, true)
    })
    this.stop = function(){
        this.movement = Movement.zero()
    }
    this.see = function(object){
        this.send(object.data('see'))
        this.seeing.add(object)
    }
    this.data = function(situation){
        switch(situation){
            case 'see':
                return {
                    id: this.id,
                    movement: this.movement.data()
                }
                break
            case 'room start':
                return {
                    id: this.id,
                    color: this.color,
                    name: this.setting.name
                }
                break
            case 'connect to waiting':
                return {
                    team: this.team,
                    name: this.name
                }
                break
        }
    }
    this.addMana = function(mana){
        this.mana += mana
        if(this.mana >= setting.maxMana) this.mana = setting.maxMana
    }
    this.send = (event, message) => socket.emit(event, message)

}
