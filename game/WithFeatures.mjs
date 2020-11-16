class WithFeatures {
	constructor() {
		this.features = new Set()
	}
	add(feature, ...args) {
		console.log(feature);
		if (
			!feature.requires.reduce(
				(acc, value) => acc && this.features.has(value),
				true
			)
		) {
			return console.error(`missing dependency in "${feature.name}"`)
		}
		feature.init.apply(this, args)
		this.features.add(feature.name)
	}
}

export default WithFeatures
