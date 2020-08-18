export default function Translator(viewportSize, serverViewportSize) {
	let center = [0, 0]
	let sizeKoefficient = viewportSize / serverViewportSize
	console.log(viewportSize);
	return {
		setCenter(newCenter) {
			center = newCenter
		},
		localToGlobal(local) {
			return [
				((local[0] - viewportSize / 2) / sizeKoefficient) + center[0],
				((local[1] - viewportSize / 2) / sizeKoefficient) + center[1]
			]
		},
		globalToLocal(global) {
			return [
				((global[0] - center[0]) * sizeKoefficient) + viewportSize / 2,
				((global[1] - center[1]) * sizeKoefficient) + viewportSize / 2
			]
		},
		getSize(originalSize) {
			return originalSize * sizeKoefficient;
		},
	}
}
