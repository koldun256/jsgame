export default {
	name: 'mana giving',
	requires: ['base collider'],
	init(amount){
		this.collider.onEnter('any', collider => {
			if(collider.type == 'viewport') return
			if(!collider.owner.mixins.has('mana')) return
			collider.owner.startMana(amount)
		})
		this.collider.onExit('any', collider => {
			if(collider.type == 'viewport') return
			if(!collider.owner.mixins.has('mana')) return
			collider.owner.endMana()
		})
	}
}
