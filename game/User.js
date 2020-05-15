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
            let player = new Player(   socket,
                                        {
                                            id:         util.generateID(),
                                            name:       data.name,
                                            room
                                        })
            player.spells = data.spells.map(spellData => new Spell(player, spellData))
            this.player = player
            console.log(1)
            room.addPlayer(this.player)
            let roomData = room.data('connect')
            socket.emit('response room enter', {status: 'success', room: roomData})
            console.log(3)
        }catch(e){
            console.log(e.stack)
            socket.emit('response room enter', {status: 'error', error: e})
        }

    })
}

module.exports = User
