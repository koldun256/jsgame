import GameObject from '../GameObject.mjs'
import Movement from '../Movement';

class Bullet extends GameObject {
	constructor(room, position, size, speed, select, target) {
		super(room, 'bullet', position, size, speed)
		this.setMovement(new Movement(this, target, speed, false))
		this.collider.onTouch('player', select)
	}
}

export default {
	type: 'player',

	name: 'Пуля',

	defenition: 'Выбирает игрока, поражённого пулей',

	parameters: [
		{ type: 'number', name: 'Скорость' },
		{ type: 'number', name: 'Продолжительность жизни' },
		{ type: 'number', name: 'Размер' },
	],

	parametersDefault: [10, 5, 3],

	valid: (parameters) =>
		parameters.reduce(
			(acc, parameter) => acc && typeof parameter == 'number',
			true
		),

	selectors: [{ type: 'place', defenition: 'Направление' }],

	create: (owner, parameters, selectors) => {
		let object = {}
		object.select = () =>
			new Promise((resolve) => {
				selectors[0]
					.select()
					.then(
						(position) =>
							new Bullet(
								owner.room,
								[...owner.position],
								[parameters[2], parameters[2]],
								parameters[1],
								resolve,
								position
							)
					)
			})
		object.mana = () => parameters[0] * parameters[1] * parameters[2]
		return object
	},
}
