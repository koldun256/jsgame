const Collider = require("./Collider.js");
const GameObject = require("./GameObject.js");
const Spell = require("./Spell.js");

function Player(socket, name, room, team, spellsData) {
	let size = room.settings["player size"];
	let speed = room.settings["player speed"];
	let viewportSize = room.settings["viewport"];
	let startMana = room.settings["start mana"];
	let maxMana = room.settings["max mana"];
	let manaRegen = room.settings["mana regen"];

	this.__proto__ = new GameObject(
		room,
		"player",
		[...team.position],
		size,
		speed
	);
	this.name = name;
	this.socket = socket;
	this.seeing = new Set();
	this.spells = spellsData.map(spellData => new Spell(this, spellData));
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

	team.add(this);

	socket.on("movement target", target => this.setTarget(target));
	socket.on("cast", spellIndex => this.cast(spellIndex));

	this.viewport.onTouch("all", object => this.see(object));
	this.viewport.onExit("all", object => this.unsee(object));

	//this.collider.onTouch('mana zone', () => this.send('mana start'))
	//this.collider.onExit('mana zone', () => this.send('mana end'))
	//this.collider.onStay("mana zone", () => this.addMana(manaRegen));

	this.room.eventSystem.on("change movement", object => {
		if (this.seeing.has(object) || object == this)
			this.send("change movement", {
				id: object.id,
				movement: object.movement.data()
			});
	});
}

module.exports = Player;
