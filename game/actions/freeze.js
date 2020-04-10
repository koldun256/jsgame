module.exports = {
    name: 'Заморозка',

    defenishion: 'Игрок на несколько секунд тепряет возможность что-либо делать',

    manaCost: (parameters, SMCs) => parameters[0] * 40 * SMCs[0],

    parameters: [{type: 'number', name: 'Длительность заморозки'}],

    parametersDefault: [10],

    validateParameters: parameters => typeof parameters[0] == 'number' && parameters[0] >= 1 && parameters[0] <= 20,

    selectors: [{ type: 'player', name: 'Игрок, который будет заморожен' }],

    create: (owner, parameters, selectors) => {
        let object = {cast: selectors[0].cast()}

        selectors[0].returnResult = result => {
            for(let player of result){
                player.state = 'freezed'
                player.send('freezed', parameters[0])
                player.stop()
                setTimeout( () => player.state = 'active', parameters[0]*1000)
            }
        }

        return object
    }

    src: 'freeze.png'
}
