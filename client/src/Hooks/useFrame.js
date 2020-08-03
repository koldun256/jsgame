let actions = []
setInterval(() => {
	console.log('frame', actions.length)
	actions.forEach(action => action())
	actions = []
}, 100)

export function useFrame(operation){
	console.log('setting listener')
	actions.push(operation)
}
