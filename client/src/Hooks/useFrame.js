let actions = []
setInterval(() => {
	let prevActions = [...actions]
	actions = []
	prevActions.forEach(action => action())
}, 100)

export function useFrame(operation){
	actions.push(operation)
}
