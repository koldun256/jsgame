const Team = require("./Team");
const Collider = require("./Collider");
const setting = require("./setting.json");
const util = require("./util");
const Main = require("./Main");
const Movement = require("./Movement");
const Event = require('./Event.js')

let rooms = [];
function Room(mode) {
	let update, sync;
	let gameObjects = [];
	let teams = [];
	let players = [];

	this.settings = setting.modes[mode];
	this.events = new Event()
	this.id = util.generateID();
	this.isWaiting = true;

	this.getTeam = function (teamID) {
		if (teamID) {
			return (
				teams.find(team => team.id == teamID)
			);
		} else {
			let team = teams.most(team => -team.players.length);
			console.log(team)
			return team
		}
	};

	this.start = function () {
		Collider.update();
		players.forEach(protagonist => {
			protagonist.send("room start", {
				knowing: gameObjects.map(gm =>
					gm.data("know").add({ protagonist: gm == protagonist })
				),
				seeing: [...protagonist.seeing].map(object =>
					object.data("see")
				)
			});
		});
		Main.broadcast("room start", this.id);
		update = Main.on("update", () => this.onFrame());
		sync = Main.on("sync", () => this.onSync());
		isWaiting = false;
		setTimeout(() => {players[1].setTarget([4700, 3200])}, 2000)
	};

	this.onFrame = function () {
		gameObjects
			.filter(gm => "lifetime" in gm)
			.forEach(gm => {
				gm.lifetime--;
				if (!gm.lifetime)
					gameObjects.splice(gameObjects.indexOf(gm), 1);
			});
		gameObjects.filter(gm => "movement" in gm).forEach(gm => gm.move());
		Collider.update();
	};

	this.onSync = function () {
		this.send("sync", player => player.data("sync"));
	};

	this.end = function (endData) {
		update.end();
		sync.end();
		Main.broadcast("room end", this.id);
		this.send("end", function (player) {
			return this.data("end", endData);
		});
	};

	this.send = function (msg, genContent) {
		players.forEach(player => player.send(msg, genContent(player)));
	};

	this.addPlayer = function (user, name, spellsData, teamID) {
		let team = this.getTeam(teamID);
		let player = user.createPlayer(name, this, team, spellsData);
		players.push(player);
		gameObjects.push(player);
		player.send("response room enter", this.data("connect"));
		this.send("adding to waiting", () => player.data("connect to waiting"));

		console.log('team1', teams[0].players.map(player => player.name))
		console.log('team2', teams[1].players.map(player => player.name))
		if (!teams.some(team => !team.full()))
			setTimeout(() => this.start(), 1000);
	};

	this.data = function (situation, params) {
		switch (situation) {
			case "end":
				return {
					winner: params.winner.id
				};
				break;
			case "connect":
				let data = {
					waiting: players.map(player =>
						player.data("connect to waiting")
					),
					id: this.id
				};
				return data;
		}
	};

	//генерация баз и команд
	this.settings["bases positions"].forEach(basePosition => {
		let newTeam = new Team(this, basePosition)	
		teams.push(newTeam);
		gameObjects.push(newTeam)
	})
	
	console.log(teams)

	//Collider.generateManaZones(
	//	this.settings["bases positions"],
	//	this.settings["mana zone distance"],
	//	this.settings["mana zone width"],
	//	this
	//);
	rooms.push(this);
}
new Room("DM");
Room.getRooms = () => [...rooms];
Room.getRoomByID = id => {
	for (let room of rooms) if (room.id == id) return room;
};
Room.random = () => rooms[Math.floor(Math.random() * rooms.length)];
module.exports = Room;
