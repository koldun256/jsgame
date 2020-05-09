function Spell(player, data){
    function parse(data){
        function recursiveParseSelector(selectorData){
            let selectorTemplate = require('./selectors/'+selectorData.name)
            if(!selectorTemplate.valid(selectorData.props)) throw('bad selector values')
            let children = selectorData.selectors.map(selectorData => recursiveParseSelector(selectorData))
            return selectorTemplate.create(player, selectorData.props, children)
        }


        let actionTemplate = require('./actions/'+data.action)
        if(!actionTemplate.valid(data.props)) throw('bad action values')
        let selectors = data.selectors.map(selectorData => recursiveParseSelector(selectorData))
        return actionTemplate.create(player, data.props, selectors)
    }

    this.action = parse(data)
    this.player = player
    this.mana   = this.action.mana
    this.cast   = this.action.cast()
}

module.exports = Spell
