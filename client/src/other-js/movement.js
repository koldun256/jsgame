export default function createMovementReducer({ step, end }) {
	let ended = false;
	let direction = [step[0] > 0 ? 1 : -1, step[1] > 0 ? 1 : -1];

	return position => {
		if (ended) return end;
		if (
			end &&
			position[0] * direction[0] > end[0] &&
			position[1] * direction[1] > end[1]
		)
			ended = true;
		return [position[0] + step[0], position[1] + step[1]];
	};
}
