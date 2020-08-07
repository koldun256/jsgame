const Movement = require("./Movement.js");
const {generateID} = require('./util.js')
module.exports = function GameObject(room, position, collider) {
	this.movement = null;

	this.id = id;
	this.room = room;
	this.position = position;
	this.collider = collider;

	this.data = function (situation) {
		switch (situation) {
			case "know":
				return {
					id: this.id
				};
			case "see":
				return {
					id: this.id,
					position: this.position,
					movement: this.movement ? this.movement.data() : null
				};
		}
	};

	this.move = function () {
		if (!this.movement) throw "moving static object";
		this.movement.move();
	};

	this.changeMovement = function (movement) {
		this.movement = movement;
		this.room.eventSystem.emit("change movement", this);
	};

	this.stop = function () {
		this.changeMovement(Movement.zero());
	};

	this.teleport = function (position) {
		this.stop();
		this.position = position;
	};
};
