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
            room.addPlayer(this.player)
            socket.emit('response room enter', {status: 'success', room: room.data('connect')})
        }catch(e){
            console.log(e)
            socket.emit('response room enter', {status: 'error', error: e})
        }

    })
}

module.exports = User
