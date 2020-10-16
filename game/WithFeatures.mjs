class WithFeatures {
	constructor() {
		this.features = new Set()
	}
	add(feature, ...args) {
		if (
			!feature.requires.reduce(
				(acc, value) => acc && this.features.has(value),
				true
			)
		) {
			return console.error(`missing dependency in "${feature.name}"`)
		}
		feature.init.call(this, args)
		this.feature.add(feature.name)
	}
}

export default WithFeatures
