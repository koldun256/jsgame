import setting from '../setting.json'
export default {
    name: 'Стан',

    defenition: 'Игрок на несколько секунд теряет возможность что-либо делать, после чего телепортируется на базу',

    parameters: [{type: 'number', name: 'Длительность стана'}],

    parametersDefault: [10],

    valid: parameters => typeof parameters[0] == 'number' && parameters[0] >= 1 && parameters[0] <= 20,

    selectors: [{type: 'player', definition: 'Игрок, который будет убит'}],

    create: (owner, parameters, selectors) => {
        return {
            cast: async function(){
                let players = await selectors[0].select()
                for(let player of players){
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
            },
            mana: () => 10 * selectors[0].mana()
        }
    },

    src: 'stun.png'
}
