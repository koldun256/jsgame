module.exports = {
    name: 'Заморозка',

    defenishion: 'Игрок на несколько секунд тепряет возможность что-либо делать',

    parameters: [{type: 'number', name: 'Длительность заморозки'}],

    parametersDefault: [10],

    valid: parameters => typeof parameters[0] == 'number' && parameters[0] >= 1 && parameters[0] <= 20,

    selectors: [{ type: 'player', name: 'Игрок, который будет заморожен' }],

    create: (owner, parameters, selectors) => {
        return {
            cast: async function(){
                let players = await selectors[0].select()
                for(let player of players){
                    player.state = 'freezed'
                    player.send('freezed', parameters[0])
                    player.stop()
                    setTimeout( () => player.state = 'active', parameters[0]*1000)
                }
            },
            mana: () => 20 * parameters[0] * selectors[0].mana()
        }
    },

    src: 'freeze.png'
}
