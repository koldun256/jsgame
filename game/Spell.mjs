import templates from './SpellTemplates.mjs'
function parse(player, data){
	function recursiveParseSelector(selectorData) {
		let selectorTemplate = templates.selectors[selectorData.name]

		if (!selectorTemplate.valid(selectorData.props))
			throw 'bad selector values'

		let children = selectorData.selectors.map(recursiveParseSelector)
		let selectorObject = selectorTemplate.create(
			player,
			selectorData.props,
			children
		)

		return selectorObject
	}

	let actionTemplate = templates.actions[data.action]
	if (!actionTemplate.valid(data.props)) throw 'bad action values'
	let selectors = data.selectors.map((selectorData) =>
		recursiveParseSelector(selectorData)
	)
	return actionTemplate.create(player, data.props, selectors)
}
class Spell {
	constructor(player, data){
		this.action = parse(player, data)
		this.player = player
		this.mana = this.action.mana
		this.cast = this.action.cast
	}
}

export default Spell
