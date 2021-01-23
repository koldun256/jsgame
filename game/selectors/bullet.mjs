import Moving from '../features/Moving.mjs'
import Visible from '../features/Visible.mjs'
import EventSystem from '../features/EventSystem.mjs'
import BasicCollider from '../features/BasicCollider.mjs'
import WithFeatures from '../WithFeatures.mjs'
import { Parameter, SelectorField, SelectorTemplate } from '../Spell.mjs'

const sizeParameter = new Parameter({
	type: 'number',
	defenition: 'Размер',
	default: 3,
	validate: () => true,
	id: 'size'
})

const speedParameter = new Parameter({
	type: 'number',
	defenition: 'Скорость',
	default: 10,
	validate: () => true,
	id: 'speed'
})

const lifetimeParameter = new Parameter({
	type: 'number',
	defenition: 'Продолжительность жизни',
	default: 5,
	validate: () => true,
	id: 'lifetime'
})

const targetSelector = new SelectorField({
	type: 'place',
	defenition: 'Напраление',
	id: 'target'
})

const cast = context =>
	context.value(targetSelector).begin().then(() => new Bullet(context))

const cost = context =>
	context.value(speedParameter) *
	context.value(lifetimeParameter) *
	context.value(sizeParameter)

class Bullet extends WithFeatures {
	constructor(context){
		super()
		
		this.room = context.room
		this.position = [...context.player.position]
		this.type = 'Bullet'

		this.add(EventSystem)
		this.add(BasicCollider, { size: context(sizeParameter) }, 'rect')
		this.add(Visible)
		this.add(Moving, context(speedParameter))

		context.room.registrate(this)

		this.collider.on('Player', collider => context.resolve(collider.owner))
	}
}

export default new SelectorTemplate({
	type: 'player',
	id: 'bullet',
	name: 'Пуля',
	defenition: 'Выбирает игрока, поражённого пулей',
	parameters: [speedParameter, sizeParameter, lifetimeParameter],
	selectors: [targetSelector],
	cast,
	cost
})
