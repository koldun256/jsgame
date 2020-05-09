const Main      = require('./Main.js')
const Team      = require('./Team.js')
const Collider  = require('./Collider.js')
const setting   = require('./setting.js')
const util      = require('./util.js')

let rooms = []
function Room(roomSetting){
    let update, sync
    let gameObjects = []
    let teams = []

    function start(){
        this.getGameObjects('type', 'player').forEach(player => player.setPosition(player.team.base))
        this.send('start', player => player.data('on start to me'))
        Main.broadcast('room start', this.id)
        update = Main.on('update', onFrame)
        sync = Main.on('sync', onSync)
        isWaiting = false
    }
    function autoGetTeam(){
        let result
        let minimum = teams[0].players().length
        teams.forEach(team => {
            if(team.players().length < minimum) result = team
        })
        return result
    }
    function onFrame(){
        this.getGameObjects('lifetime').forEach(gm => {
            gm.lifetime--
            if(gm.lifetime < 0) this.destroy(gm.id)
        })
        this.getGameObjects('movable', true).forEach(gm => gm.object.movement.move())
        Collider.update()
    }
    function onSync(){
        this.send('sync', player => player.data('sync'))
    }

    this.end = function(endData){
        update.end()
        sync.end()
        Main.broadcast('room end', this.id)
        this.send('end', function(player){return this.data('end', endData)})
    }
    this.id = util.generateID()
    this.addGameObject = function(gameObject){
        gameObject.id = util.generateID()
        gameObject.object.room = this
        gameObjects.push(gameObject)
        if(gameObject.visible) gameObject.object.collider.onTouch('viewport', player => player.see(gm.object))
        if(gameObject.needsMana) gameObject.object.collider.onStay('mana zone', () => gameObject.object.addMana(setting['mana regen']))
    }
    this.getGameObjects = function(...args){
        let result = []
        if(args.length == 1){
            gameObjects.forEach(gm => {
                if(args[0] in gm) result.push(gm)
            })
        }else{
            gameObjects.forEach(gm => {
                if(gm[args[0]] == args[1]) result.push(gm)
            })
        }
        return result
    }
    this.send = function(msg, genContent){
        this.getGameObjects('type', 'player').forEach(player => player.send(msg, genContent(player)))
    }
    this.addPlayer = function(player, teamID){
        let team
        if(teamID){
            team = Team.getByID(teamID)
            if(!teams.includes(team)) {
                throw 'adding to unexistent team'
            }
        }else {
            team = autoGetTeam()
        }
        team.add(player)
        this.send('adding to waiting', () => player.data('connect to waiting'))
        this.addGameObject({
            object: player,
            type: 'player',
            needsMove: true,
            visible: true,
            needsMana: true
        })

        let hasNotFullTeam = false
        teams.forEach(team => {
            if(!team.full()) hasNotFullTeam = true
        })
        if(!hasNotFullTeam) start()
    }
    this.data = function(situation, params){
        switch(situation){
            case 'end':
                return {
                    winner: params.winner.id
                }
        }
    }
    this.isWaiting = true

    setting.modes[roomSetting.mode]['bases positions'].forEach(basePosition => teams.push(new Team(basePosition, setting.modes[roomSetting.mode]['players in team'], this)))

    Collider.generateManaZones( setting.modes[roomSetting.mode]['bases positions'],
                                setting['mana zone distance'],
                                setting['mana zone width'],
                                this)
    rooms.push(this)
}
Room.getRooms = () => [...rooms]
Room.getRoomByID = id => {for(let room of rooms) if(room.id == id) return room}
Room.getRandom = () => rooms[Math.floor(Math.random()*rooms.length)]
module.exports = Room
