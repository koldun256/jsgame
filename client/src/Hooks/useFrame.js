let actions = []
setInterval(() => {
	console.log('frame', actions)
	let prevActions = actions
	actions = []
	prevActions.forEach(action => action())
}, 100)

export function useFrame(operation){
	actions.push(operation)
	console.log('setting listener, ', actions)
}
