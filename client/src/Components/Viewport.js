import React, {Component} from 'react'
import injectSheet from 'react-jss'
import GameObject from './GameObject'

const styles = {
    viewport: {
        position: 'absolute',
        left: 'auto',
        right: 'auto',
        border: '1px solid black',
        height: 1080,
        width: 1080,
        overflow: 'hidden'
    }
}

class Viewport extends Component {
    constructor(props){
        super(props)
        this.state = {
            seeing: props.seeing,
            me: {type: 'player', position: props.me.position, id: props.me.id},
            position: props.me.position
        }
        this.move = this.move.bind(this)
    }
    move(newPosition){
        this.setState({position: newPosition})
    }
    render(props){
        console.log(this.state.position)
        return (
            <div className={this.props.classes.viewport}>
                <GameObject center={this.state.position} gameobject={({type: 'bg', position: [3000, 3000]})} />
                <GameObject key={this.state.me.id} center={this.state.position} changePosition={this.move} gameobject={this.state.me} me/>
                {this.state.seeing.map(object => {
                    console.log('asd')
                    return <GameObject center={this.state.position} key={object.id} gameobject={object} />
                })}
            </div>
        )
    }
}

export default injectSheet(styles)(Viewport)
