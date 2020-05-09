const Movement  = require('../Movement.js')
const Direction = require('../Direction.js')
const Collider  = require('../Collider.js')
const Main      = require('../Main.js');

module.exports = {
    type: 'player',

    name: 'Пуля',

    defenition: 'Выбирает игрока, поражённого пулей',

    parameters: [   {type: 'number', name: 'Скорость'},
                    {type: 'number', name: 'Продолжительность жизни'},
                    {type: 'number', name: 'Размер'} ],

    parametersDefault: [10, 5, 3],

    valid: parameters => parameters.reduce((acc, parameter) => acc && typeof parameter == 'number', true),

    selectors: [{type: 'place', defenition: 'Направление'}],

    create: (owner, parameters, selectors) => {
        return object = {
            select: () => {
                return new Promise(async resolve => {
                    let place = await selectors[0].select()

                    function Bullet(){
                        this.position = [...owner.position]
                        this.movement = new Movement(   this,
                                                        new Direction([...owner.position], place),
                                                        this.parameters[0],
                                                        false)
                        this.collider = new Collider(    this,
                                                        [this.parameters[2], this.parameters[2]],
                                                        'bullet')
                        this.collider.onTouch('player', player => resolve([player]))
                        this.data = function(situation){
                            let data = {empty: 'empty'}
                            switch(situation){
                                case 'see':
                                    data = {color:      owner.team.color,
                                            position:   [...bullet.position],
                                            speed:      parameters[0],
                                            lifetime:   parameters[1],
                                            size:       parameters[2],
                                            direction:  bullet.movement.direction.toString()}
                            }
                            return data
                        }
                    }
                    let bullet = new Bullet()
                    owner.room.addGameObject({  object: bullet,
                                                type: 'bullet',
                                                needsMove: true,
                                                lifetime: parameters[1],
                                                visible: true})
                })
            },
            mana: () => parameters[0] * parameters[1] * parameters[2]
        }
    }
}
