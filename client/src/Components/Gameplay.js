import React, {Component} from 'react'
import Viewport from './Viewport'

class Gameplay extends Component {
    constructor(props){
        super(props)
    }

    render(){
        return (
            <div>
                <Viewport players={this.props.data.others} seeing={this.props.data.startSeeing} me={this.props.data.me}/>
            </div>
        )
    }
}

export default Gameplay
