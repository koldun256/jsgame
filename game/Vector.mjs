class Vector {
	constructor(startPos, finishPos) {
		this.startDelta = [
			finishPos[0] - startPos[0],
			finishPos[1] - startPos[1],
		]
		this.startSize = Math.sqrt(
			this.startDelta[0] ** 2 + this.startDelta[1] ** 2
		)
		this.end = finishPos
		this.start = startPos
	}
	getStep(size) {
		if (size == 0) return [0, 0]
		let k = size / this.startSize
		return [this.startDelta[0] * k, this.startDelta[1] * k]
	}
	inEdges(point) {
		return (
			[this.start[0], point[0], this.end[0]].middle() == point[0] &&
			[this.start[1], point[1], this.end[1]].middle() == point[1]
		)
	}
}

export default Vector
