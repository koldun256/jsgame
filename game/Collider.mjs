import CollisionListener from './CollisionListener'

class Collider {
	constructor(owner, size, type, collisionSystem) {
		console.log(owner);
		this.size = [...size];
		this.position = owner.position;
		this.owner = owner;
		this.type = type;
		this.collisionSystem = collisionSystem;

		collisionSystem.addCollider(this)
	}

	isTouching(other) {
		let a = false,
			b = false,
			c = false,
			d = false;
		if (other.position[0] > this.position[0]) {
			b =
				other.position[0] - other.size[0] <
				this.position[0] + this.size[0];
		} else {
			a =
				other.position[0] + other.size[0] >
				this.position[0] - this.size[0];
		}
		if (other.position[1] > this.position[1]) {
			d =
				other.position[1] - other.size[1] <
				this.position[1] + this.size[1];
		} else {
			c =
				other.position[1] + other.size[1] >
				this.position[1] - this.size[1];
		}
		let result = (a || b) && (c || d);
		return result;
	}

	onExit(type, callback) {
		new CollisionListener("exit", callback, this, type);
	}

	onEnter(type, callback) {
		new CollisionListener("enter", callback, this, type);
	}

	onStay(type, callback) {
		new CollisionListener("stay", callback, this, type);
	}
}

Collider.generateManaZones = function (basePositions, distance, width, room) {
	basePositions.forEach(basePosition => {
		let zone = new Collider(
			{ position: basePosition, room: room },
			[0, 0],
			"mana zone"
		);
		zone.isTouching = other => {
			function calcDistance(pointA, pointB) {
				return Math.abs(
					Math.sqrt(
						(pointA[0] - pointB[0]) ** 2 +
							(pointA[1] - pointB[1]) ** 2
					)
				);
			}
			let playerDistance = calcDistance(other.position, basePosition);
			return (
				playerDistance > distance / 2 - width / 2 &&
				playerDistance < distance / 2 + width / 2
			);
		};
	});
};
export default Collider;
