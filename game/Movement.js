const Direction = require('./Direction.js')
function Movement(owner, target, speed, hasEnd = true){
	this.vector = new Vector([...owner.position], target)
    this.move = () => {
        let delta = this.vector.getStep(speed)
        owner.position[0] += delta[0]
        owner.position[1] += delta[1]
        if(hasEnd && !this.vector.inEdges(owner.position)) owner.stop()
    }
    this.data = situation => ({
        step: this.vector.getStep(speed),
		end: hasEnd ? target : null
    })
}
Movement.zero = owner => {
    return new Movement(owner, owner.position, 0, false)
}
module.exports = Movement
