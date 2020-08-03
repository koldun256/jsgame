const util = require("./util.js");
function Vector(startPos, finishPos) {
	let startDelta = [finishPos[0] - startPos[0], finishPos[1] - startPos[1]];
	let startSize = Math.sqrt(startDelta[0] ** 2 + startDelta[1] ** 2);
	this.end = finishPos;
	this.getStep = size => {
		if(size == 0) return [0, 0]
		let k = size / startSize;
		return [startDelta[0] * k, startDelta[1] * k];
	};
	this.inEdges = point => {
		console.log([startPos[0], point[0], finishPos[0]].middle())
		return [startPos[0], point[0], finishPos[0]].middle() == point[0] &&
		[startPos[1], point[1], finishPos[1]].middle() == point[1];
	}
}
module.exports = Vector;
