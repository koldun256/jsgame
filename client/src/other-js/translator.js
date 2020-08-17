export default function Translator(width, height){
	let center = [0,0]
	return {
		setCenter(newCenter){
			center = newCenter
		},
		localToGlobal(local){
			return [
				local[0] + center[0] - height / 2,
				local[1] + center[1] - width/ 2,
			]
		},
		globalToLocal(global){
			return [
				global[0] - center[0] + height / 2, 
				global[1] - center[1] + width / 2
			]
		}
	}
}
