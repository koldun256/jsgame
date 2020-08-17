const frameDelay = 100
let actions = new Set()

setInterval(() => {
	[...actions].forEach(action => action())
}, frameDelay)

export default function eachFrame(operation){
	actions.add(operation)
	return () => actions.delete(operation)
}
