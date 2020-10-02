export default function Translator(viewportSize, serverViewportSize) {
	let center = [3, 3]
	let sizeKoefficient = viewportSize / serverViewportSize
	return {
		setCenter(newCenter) {
			center = [...newCenter]
		},
		localToGlobal(local){
			return [
				((local[0] - viewportSize / 2) / sizeKoefficient) + center[0],
				((local[1] - viewportSize / 2) / sizeKoefficient) + center[1]
			]
		},
		globalToLocal(global) {
			//console.log(global, center, sizeKoefficient, viewportSize);
			return [
				((global[0] - center[0]) * sizeKoefficient) + viewportSize / 2,
				((global[1] - center[1]) * sizeKoefficient) + viewportSize / 2
			]
		},
		getSize(originalSize) {
			return [
				originalSize[0] * sizeKoefficient,
				originalSize[1] * sizeKoefficient
			];
		},
	}
}
