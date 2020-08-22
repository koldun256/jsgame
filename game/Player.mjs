import Collider from './Collider.mjs'
import GameObject from './GameObject.mjs'
import Spell from './Spell.mjs'

class Player extends GameObject {
	constructor(socket, name, room, team, spellsData) {
		let size = room.settings['player size']
		let speed = room.settings['player speed']
		let viewportSize = room.settings['viewport']
		let startMana = room.settings['start mana']

		super(room, 'player', [...team.position], size, speed)

		this.name = name
		this.socket = socket
		this.seeing = new Set()
		this.spells = spellsData.map(spellData => new Spell(this, spellData))
		this.mana = startMana
		this.viewport = new Collider(
			this,
			{size: viewportSize},
			'rect',
			'viewport',
			room.collisionSystem
		)
		this.team = team
		this.setting = this.room.settings

		team.add(this)

		this.room.eventSystem.on('change movement', object => {
			if (this.seeing.has(object) || object == this)
				this.send('change movement', {
					id: object.id,
					movement: object.movement.data(),
				})
		})

		socket.on('movement target', target => this.setTarget(target))
		socket.on('cast', spellIndex => this.cast(spellIndex))

		this.viewport.onEnter('all', object => this.see(object))
		this.viewport.onExit('all', object => this.unsee(object))

		//this.collider.onTouch('mana zone', () => this.send('mana start'))
		//this.collider.onExit('mana zone', () => this.send('mana end'))
		//this.collider.onStay("mana zone", () => this.addMana(manaRegen));
	}

	cast(spellIndex) {
		let spell = this.spells[spellIndex]
		if (!spell) throw 'unexistent spell'
		if (spell.mana() > this.mana) return this.send('not enough mana')
		this.mana -= spell.mana()
		spell.cast()
	}

	see(object) {
		console.log(`seeing object ${object.id} with type ${object.type} from ${this.id}`);
		//if (this.seeing.has(object)) throw 'see already visible object'
		this.send('see', object.data('see'))
		this.seeing.add(object)
	}

	unsee(object) {
		console.log('unseeing object');
		if (!this.seeing.has(object)) throw 'unseeing not visible object'
		this.send('unsee', object.id)
		this.seeing.delete(object)
	}

	data(situation) {
		switch (situation) {
			case 'see':
				return super.data('see')
			case 'know':
				return super.data('know').add({
					team: this.team.id,
					name: this.name,
				})
			case 'connect to waiting':
				return {
					id: this.id,
					team: this.team.id,
					name: this.name,
				}
			default:
				return {}
		}
	}

	addMana(mana) {
		this.mana += mana
		if (this.mana >= this.setting['max mana'])
			this.mana = this.setting['max mana']
	}

	send(event, message) {
		this.socket.emit(event, message)
	}
}

export default Player
