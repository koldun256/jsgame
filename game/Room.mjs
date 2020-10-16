import Team from './Team'
import setting from './setting.json'
import * as util from './util'
import * as Main from './Main.mjs'
import EventSystem from './EventSystem'
import CollisionSystem from './CollisionSystem'
class Room {
	constructor(mode) {
		this.gameObjects = []
		this.teams = []
		this.players = []
		this.settings = setting.add(setting.modes[mode])
		this.eventSystem = new EventSystem()
		this.collisionSystem = new CollisionSystem()
		this.id = util.generateID()

		//генерация баз и команд
		this.settings['bases positions'].forEach(basePosition => {
			let newTeam = new Team(this, basePosition)
			this.teams.push(newTeam)
		})
	}

	getTeam(teamID) {
		if (teamID) {
			return this.teams.find(team => team.id == teamID)
		} else {
			let team = this.teams.most(team => -team.players.length)
			return team
		}
	}

	start() {
		this.collisionSystem.update()
		this.players.forEach(protagonist => {
			protagonist.send('room start', {
				seeing: [...protagonist.seeing].map(object =>
					object.data('see')
				).concat([protagonist.data('see').add({protagonist: true})]),
			})
		})
		Main.eventSystem.emit('room start', this.id)
		Main.eventSystem.on('update', () => this.onFrame())
		Main.eventSystem.on('sync', () => this.onSync())
	}

	onFrame() {
		this.gameObjects
			.filter(gm => 'lifetime' in gm)
			.forEach(gm => {
				gm.lifetime--
				if (!gm.lifetime)
					this.gameObjects.splice(this.gameObjects.indexOf(gm), 1)
			})
		this.gameObjects.filter(gm => 'movement' in gm).forEach(gm => gm.move())
		this.collisionSystem.update()
	}

	onSync() {
		this.send('sync', player => player.data('sync'))
	}

	end(endData) {
		Main.broadcast('room end', this.id)
		this.send('end', () => this.data('end', endData))
	}

	send(msg, genContent) {
		this.players.forEach(player => player.send(msg, genContent(player)))
	}

	addPlayer(user, name, spellsData, teamID) {
		let team = this.getTeam(teamID)
		let player = user.createPlayer(name, this, team, spellsData)
		this.send('adding to waiting', () => player.data('connect to waiting'))
		this.players.push(player)
		player.send('response room enter', this.data('connect'))

		if (!this.teams.some(team => !team.full()))
			setTimeout(() => this.start(), 1000)
	}

	data(situation, params) {
		switch (situation) {
			case 'end':
				return {
					winner: params.winner.id,
				}
			case 'connect':
				return {
					waiting: this.players.map(player =>
						player.data('connect to waiting')
					),
					id: this.id,
				}
		}
	}
}

export default Room
