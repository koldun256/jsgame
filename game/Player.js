const Movement = require("./Movement.js");
const Direction = require("./Direction.js");
const Collider = require("./Collider.js");
const GameObject = require("./GameObject.js");
function Player(room, position, name, spells, team, socket) {
	let size = room.settings["player size"];
	let speed = room.settings["player speed"];
	let viewportSize = room.settings["viewport"];
	let startMana = room.settings["start mana"];
	let maxMana = room.settings["max mana"];
	let manaRegen = room.settings["mana regen"];

	this.__proto__ = new GameObject(room, "player", position, size, speed);
	this.name = name;
	this.socket = socket;
	this.seeing = new Set();
	this.spells = spells;
	this.mana = startMana;
	this.viewport = new Collider(this, viewportSize, "viewport");
	this.team = team;

	this.cast = function (spellIndex) {
		let spell = this.spells[spellIndex];
		if (!spell) throw "unexistent spell";
		if (spell.mana() > this.mana) return socket.emit("not enough mana");
		this.mana -= spell.mana();
		spell.cast();
	};

	this.see = function (object) {
		if (this.seeing.has(object)) throw "see already visible object";
		this.send("see", object.data("see"));
		this.seeing.add(object);
	};

	this.unsee = function (object) {
		if (!this.seeing.has(object)) throw "unseeing not visible object";
		this.send("unsee", object.id);
		this.seeing.delete(object);
	};

	this.data = function (situation) {
		switch (situation) {
			case "see":
				return this.__proto__.data("see");
			case "know":
				return this.__proto__.data("know").add({
					team: this.team.id,
					name: this.name
				});
			case "connect to waiting":
				return {
					id: this.id,
					team: this.team.id,
					name: this.name
				};
		}
	};

	this.addMana = function (mana) {
		this.mana += mana;
		if (this.mana >= setting.maxMana) this.mana = setting.maxMana;
	};

	this.send = (event, message) => {
		this.socket.emit(event, message);
	};

	socket.on("movement target", target => this.setTarget(target));
	socket.on("cast", spellIndex => this.cast(spellIndex));

	this.viewport.onTouch("all", collider => this.see(collider.owner));
	this.viewport.onExit("all", collider => this.unsee(collider.owner));
	
	this.collider.onTouch('mana zone', () => this.send('mana start'))
	this.collider.onExit('mana zone', () => this.send('mana end'))
	this.collider.onStay("mana zone", () => this.addMana(manaRegen));

	this.room.events.on("change movement", object => {
		if (this.seeing.has(object) || object == this)
			this.send("change movement", object.id);
	});
}

module.exports = Player;
