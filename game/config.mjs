export default {
	modes: {
		DM: {
			points: {
				stun: 5
			},
			'need points to win': 20,
			width: 6000,
			height: 6000,
			'player speed': 10,
			'players in team': 2,
			'base size': [100, 100],
			'bases positions': [
				[1500, 3000],
				[4500, 3000]
			],
			'player size': [50, 50],
			viewport: [900, 900],
			'max mana': 2000,
			'start mana': 1000,
			'mana regen': 10,
			'mana zone width': 150,
			'mana zone distance': 500
		}
	},
	FPS: 10,
	'sync delay': 1000,
	colors: {
		Player: "#FF9090",
		Base: "#A0A0A0",
		ManaZone: "#9090FF",
		protagonist: "#90FF90"
	}
}
