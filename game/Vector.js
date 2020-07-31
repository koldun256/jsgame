const util = require("./util.js");
function Vector(startPos, finishPos) {
	let startDelta = [finishPos[0] - startPos[0], finishPos[1] - startPos[1]];
	let startSize = Math.sqrt(startDelta[0] ** 2 + startDelta[1] ** 2);
	this.end = finishPos;
	this.getStep = size => {
		let k = size / startSize;
		return [startDelta[0] * k, startDelta[1] * k];
	};
	this.inEdges = point =>
		util.middle(startPos[0], point[0], finishPos[0]) == point[0] &&
		util.middle(startPos[1], point[1], finishPos[1]) == point[1];
}
module.exports = Vector;
