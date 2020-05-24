export default function createMovement(object, step, end){
    let direction = [step[0] > 0 ? 1 : -1, step[1] > 0 ? 1 : -1]
    function isEnded(){
        return  object.state.position[0] * direction[0] > end[0] && // reload
                object.state.position[1] * direction[1] > end[1]
    }
    return {
        move: () => {
            object.setState({
                position: [
                    object.state.position[0] + step[0],
                    object.state.position[1] + step[1]
                ]
            })
            if(!isEnded()) return false
            object.setState({positon: end})
            return true
        }
    }
}
