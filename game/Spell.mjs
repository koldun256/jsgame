class ParameterContext {
	constructor(template, values) {
		this.template = template
		this.values = values
		this.parameterFields = template.parameterFields
		this.selectorFields = template.selectorFields
		this.parameterValues = values.parameterValues
		this.selectorValues = values.selectorValues
	}
	value(field) {
		try {
			return this.parameterValue(field)
		} catch (e) {
			try {
				return this.selectorValue(field)
			} catch (e) {
				return null
			}
		}
	}
	parameterValue(field) {
		return this.parameterValues[this.parameterFields.indexOf(field)]
	}
	selectorValue(field) {
		return this.selectorValues[this.selectorFields.indexOf(field)]
	}
}
export class CastContext extends ParameterContext {
	constructor(template, values, player) {
		super(template, values)
		this.player = player
		this.room = player.room
	}
}
export class ActionTemplate {
	constructor({ id, name, defenition, parameters, selectors, cast, cost }) {
		this.id = id
		this.name = name
		this.defenition = defenition
		this.parameterFields = parameters
		this.selectorFields = selectors
		this.cast = cast
		this.calcCost = cost
	}

	fill(user, values) {
		return new FilledAction(this, user, values)
	}
}
export class Action {
	constructor(template, user, values) {
		this.template = template
		this.user = user
		this.context = new ParameterContext(template, values)
		this.cost = template.cost(this.context)
	}
	cast(player) {
		const castContext = new CastContext(
			this.template,
			this.context.values,
			player
		)
		this.template.cast(castContext)
	}
}
class Parameter {
	constructor(data){
		this.type = data.type
		this.defenition = data.defenition
		this.default = data.default
		this.validate = data.validate
		this.id = data.id
	}
}
class SelectorField {
	constructor(data){
		this.type = data.type
		this.defenition = data.defenition
		this.id = data.id
	}
}
class SelectorTemplate {
	constructor({
		type,
		id,
		name,
		defenition,
		parameters,
		selectors,
		cast,
		cost,
	}) {
		this.id = id
		this.name = name
		this.defenition = defenition
		this.parameterFields = parameters
		this.selectorFields = selectors
		this.cast = cast
		this.calcCost = cost
	}

	fill(user, parameterValues, selectorValues) {
		return new Selector(this, user, parameterValues, selectorValues)
	}
}
class Selector {}
class Spell {}
class SpellSet {
	constructor(spellData) {}
}
