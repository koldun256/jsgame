const Movement  = require('./Movement.js')
const Direction = require('./Direction.js')
const Collider  = require('./Collider.js')
function Player(socket, setting){
    this.id         = setting.id
    this.name       = setting.name
    this.socket     = socket
    this.movement   = Movement.zero()
    this.state      = 'waiting'
    this.seeing     = new Set()
    this.spells     = null
    this.room       = setting.room
    this.setting    = null
    socket.on('movement target', function(target){
        this.movement = new Movement(this, new Direction(this.position, target), this.speed, true)
    })
    socket.on('cast', function(index) {
        let spell = this.spells[spell]
        if(!spell) return socket.emit('unexistent spell')
        if(spell.mana() > this.mana) return socket.emit('not enough mana')
        this.mana -= spell.mana()
        spell.cast()
    })
    this.stop = function(){
        this.movement = Movement.zero()
    }
    this.init = function(setting){
        this.inited     = true
        this.viewport   = new Collider(this, setting.viewport, 'viewport')
        this.body       = new Collider(this, setting.size, 'player')
        this.mana       = setting.startMana
        this.maxMana    = setting.maxMana
        this.speed      = setting.speed
        this.setting    = setting
        this.color      = setting.color
        this.state      = 'active'
    }
    this.setPosition = function(newPosition){
        this.stop()
        this.position = [...newPosition]
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
            case 'room start to others':
                return {
                    id:     this.id,
                    color:  this.color,
                    name:   this.setting.name,
                    speed:  this.speed,
                    size:   this.setting.size,
                    teamID: this.team.id
                }
                break
            case 'room start to me':
                if(!this.inited) return socket.emit('server error', {error: 'uninited player'})
                return {id: this.id,
                        ...this.setting,
                        team: this.team.id,
                        position: this.position,

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

module.exports = Player
