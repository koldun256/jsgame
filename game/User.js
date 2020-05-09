const util = require('./util')
const Player = require('./Player')
const Spell = require('./Spell')
const Room = require('./Room')
const setting = require('./setting.js')

function User(socket){
    this.player = null
    socket.on('request room enter', function(data) {
        try{
            let room = Room.random()
            this.player = new Player(   socket,
                                        data.spells.map(spellData => new Spell(this.player, spellData)),
                                        {
                                            id:         util.generateID(),
                                            name:       data.name,
                                            room
                                        })
            room.addPlayer(this.player)
            socket.emit('response room enter', {status: 'success', room: room.data('connect')})
        }catch(e){
            socket.emit('response room enter', {status: 'error', error: e})
        }

    })
}

module.exports = User
