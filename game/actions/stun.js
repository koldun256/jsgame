const setting = require('../setting.js')
module.exports = {
    name: 'Стан',

    defenition: 'Игрок на несколько секунд теряет возможность что-либо делать, после чего телепортируется на базу',

    manaCost: (parameters, SMCs) => (parameters[0] * 40 + 200) * SMCs[0],

    parameters: [{type: 'number', name: 'Длительность стана'}],

    parametersDefault: [10],

    validateParameters: parameters => typeof parameters[0] == 'number' && parameters[0] >= 1 && parameters[0] <= 20,

    selectors: [{type: 'player', definition: 'Игрок, который будет убит'}],

    create: (owner, parameters, selectors) => {
        let object = { cast: () => selectors[0].cast(), parameters: parameters, selectors: selectors }

        selectors[0].returnResult = result => {

            for(let player of result){
                if(owner.game.mode == 'DM') owner.team.addPoints(setting.modes.DM.points.stun)
                player.state = 'stunned'
                player.stop()
                player.send('stunned', parameters[0])
                setTimeout( () => {
                                    player.position = [...player.team.basePosition]
                                    player.state    = 'active'
                                    player.mana     = 0
                            }, parameters[0]*1000)
            }
        }

        return object;
    },

    src: 'stun.png'
}
