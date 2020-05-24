const Direction = require('./Direction.js')
function Movement(owner, direction, speed, hasEnd){
    this.move = () => {
        let delta = direction.getStep(speed)
        owner.position[0] += delta[0]
        owner.position[1] += delta[1]
        if(hasEnd && !direction.inEdges(owner.position)) owner.stop()
    }
    this.data = situation => ({
        step: direction.getStep(speed),
        end: direction.end
    })
}
Movement.zero = () => new Movement({position: [0,0]}, new Direction([0,0], [0,0]), 0, false)
module.exports = Movement
