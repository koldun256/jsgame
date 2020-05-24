import React, {Component} from 'react'
import createMovement from '../Movement'

const styles = {
    gameObject: data => ({
        position: 'absolute',
        transform: 'translate(-50%, -50%)',
        top: data[1],
        left: data[0]
    }),
    player: data => ({
        backgroundColor: data.me ? 'yellow' : 'blue',
        width: 50,
        height: 50
    }),
    bg: data => ({
        width: 6000,
        height: 6000,
        backgroundImage: 'url(graphic/bg.png)'
    }),
    base: data => ({
        width: 100,
        height: 100,
        backgroundColor: 'grey'
    })
}

function height(){
    return 1080
}

class GameObject extends Component {
    constructor(props){
        super(props)
        this.translate = this.translate.bind(this)
        this.move = this.move.bind(this)
        this.movement = createMovement(this, [10, 10], [4600, 3100])
        this.state = {
            position: this.props.gameobject.position
        }
        if(props.gameobject.type == 'player'){
            setInterval(this.move, 100)
        }
    }

    translate(global){
        return [
            global[0] - this.props.center[0] + (height() / 2),
            global[1] - this.props.center[1] + (height() / 2)
        ]
    }

    move(){
        if(this.movement) this.movement.move()
        if(this.props.me) this.props.changePosition(this.state.position)
    }

    render(){
        let {gameobject} = this.props
        let viewportPosition = this.translate(this.state.position)
        let currentStyles = Object.assign(styles.gameObject(viewportPosition), styles[gameobject.type]({me: this.props.me}))

        return (
            <div style={currentStyles}></div>
        )
    }
}

export default GameObject
