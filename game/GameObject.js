const Movement = require("./Movement.js");
const Collider = require("./Collider.js");
const util = require('./util.js')
module.exports = function GameObject(room, type, position, size, speed) {
	this.id = util.generateID();
	this.room = room;
	this.type = type;
	this.position = position;
	this.collider = new Collider(this, size, type);

	if(speed) {
		this.speed = speed
		this.movement = Movement.zero(this)
	}

	this.data = function (situation) {
		switch (situation) {
			case "know":
				return {
					id: this.id,
					type: this.type
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
		if(!this.movement) throw 'changing movement of static object'
		this.movement = movement;
		this.room.events.emit("change movement", this);
	};

	this.stop = function () {
		this.changeMovement(Movement.zero());
	};

	this.teleport = function (position) {
		this.stop();
		this.position = position;
	};

	this.setTarget = function (target) {
		if(!this.movement) throw 'changing movement target of static object'
		this.changeMovement(new Movement(this, target, this.speed))
	}
};
