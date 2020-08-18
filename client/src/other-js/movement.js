export default movementData => {
	//throw new Error('ads')
	
	console.log('creating movement');
	let direction = [
		movementData.step[0] >= 0 ? 1 : -1,
		movementData.step[1] >= 0 ? 1 : -1,
	]

	return (position, action) => {
		if (action == 'end') {
			return movementData.end || position
		}

		let newPosition = [
			position[0] + movementData.step[0],
			position[1] + movementData.step[1],
		]

		if (
			movementData.end &&
			newPosition[0] * direction[0] >=
				movementData.end[0] * direction[0] &&
			newPosition[1] * direction[1] >= movementData.end[1] * direction[1]
		) return movementData.end || position

		return newPosition
	}
}
