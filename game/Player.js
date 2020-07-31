const Movement = require("./Movement.js");
const Direction = require("./Direction.js");
const Collider = require("./Collider.js");
const GameObject = require('./GameObject.js')
function Player(socket, setting) {
	this.id = setting.id;
	this.name = setting.name;
	this.socket = socket;
	this.movement = Movement.zero();
	this.state = "waiting";
	this.seeing = new Set();
	this.spells = null;
	this.room = setting.room;

	this.setting = null;
	socket.on(
		"movement target",
		function (target) {
			this.movement = new Movement(
				this,
				new Direction(this.position, target),
				this.speed,
				true
			);
			for (player of this.room.getGameObjects("type", player)) {
				player.send();
			}
		}.bind(this)
	);
	socket.on("cast", function (index) {
		let spell = this.spells[spell];
		if (!spell) return socket.emit("unexistent spell");
		if (spell.mana() > this.mana) return socket.emit("not enough mana"); // reload
		this.mana -= spell.mana();
		spell.cast();
	});
	this.stop = function () {
		this.movement = Movement.zero();
	};
	this.init = function (setting) {
		console.log("initing player ", this.name);
		this.inited = true;
		this.viewport = new Collider(this, setting.viewport, "viewport");
		this.collider = new Collider(this, setting.size, "player");
		this.mana = setting.startMana;
		this.maxMana = setting.maxMana;
		this.speed = setting.speed;
		this.setting = setting;
		this.color = setting.color;
		this.state = "active";
	};
	this.setPosition = function (newPosition) {
		console.log("position setting " + newPosition);
		this.stop();
		this.position = [...newPosition];
	};
	this.see = function (object) {
		this.send(object.data("see"));
		this.seeing.add(object);
	};
	this.data = function (situation) {
		switch (situation) {
			case "see":
				return {
					id: this.id,
					movement: this.movement.data(),
					position: this.position
				};
				break;
			case "room start":
				return {
					id: this.id,
					color: this.color,
					name: setting.name,
					size: this.setting.size,
					teamID: this.team.id
				};
				break;
			case "connect to waiting":
				return {
					id: this.id,
					team: this.team.id,
					name: this.name
				};
				break;
		}
	};
	this.addMana = function (mana) {
		this.mana += mana;
		if (this.mana >= setting.maxMana) this.mana = setting.maxMana;
	};
	this.send = (event, message) => {
		socket.emit(event, message);
	};
}

module.exports = Player;
