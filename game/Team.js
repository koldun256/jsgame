const util      = require('./util.js')
const Collider  = require('./Collider.js')
let teams = []
function Team(setting, room){
    let players = []
    this.points         = 0
    this.id             = util.generateID()
    this.color          = require('randomcolor')()
    this.position       = setting.basePosition
    console.log('c')
    this.baseCollider   = new Collider(this, setting.baseSize, 'base')
    this.full           = () => players.length == setting.playersCount
    this.players        = () => players
    this.addPoints      = function(points){
        this.points += points
        if(this.points >= setting.pointsToWin) room.end(this.id)
    }
    this.add            = player => {
        if(players.length < setting.playerCount){
            player.team = this
            players.push(player)
        }
    }
    teams.push(this)
}
Team.getByID = id => {
    for(let team of teams){
        if(team.id == id){
            return team
        }
    }
}
module.exports = Team
