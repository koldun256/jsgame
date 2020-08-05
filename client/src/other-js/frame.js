let actions = []
setInterval(() => {
	let prevActions = [...actions]
	actions = []
	prevActions.forEach(action => action())
}, 100)

export default function nextFrame(operation){
	actions.push(operation)
}
