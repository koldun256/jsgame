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

    validateParameters: [   value => typeof value == 'number',
                            value => typeof value == 'number',
                            value => typeof value == 'number'],

    selectors: [{type: 'place', defenition: 'Направление'}],

    manaCost: (parameters, SMCs) => parameters[0] * parameters[1] * parameters[2],

    create: (owner, parameters, selectors) => {
        let object = {cast: () => selectors[0].cast()

        selectors[0].returnResult = function(result) {
            function Bullet(){
                this.position = [...owner.position]
                this.movement = new Movement(   this,
                                                new Direction(  [...owner.position],
                                                                result),
                                                this.parameters[0],
                                                false)
                this.collider = new Collider(    this,
                                                [this.parameters[2], this.parameters[2]],
                                                'bullet')
                this.collider.onTouch('player', player => object.returnResult([player]))
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
                                        visible: true}
        }

        return object
    }
}
