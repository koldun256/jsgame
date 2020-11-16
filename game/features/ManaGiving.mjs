export default {
	name: 'mana giving',
	requires: ['basic collider'],
		init(amount){
			this.collider.onEnter('all', collider => {
				if(collider.type == 'viewport') return
				if(!collider.owner.features.has('mana')) return
				collider.owner.startMana(amount)
			})
			this.collider.onExit('all', collider => {
				if(collider.type == 'viewport') return
				if(!collider.owner.features.has('mana')) return
				collider.owner.endMana()
			})
		}
}
