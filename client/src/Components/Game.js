import React, {Component} from 'react'
import Gameplay from './Gameplay'
import Gamewait from './Gamewait'
import {socket} from '../util'

class Game extends Component {
    constructor(props){
        super(props)
        this.state = {
            location: 'wait'
        }
        this.startPlay = this.startPlay.bind(this) 
    }
    startPlay(data){
        this.setState({data, location: 'play'})
    }
    render(){
        if(this.state.location == 'wait'){
            return(
                <Gamewait data={this.props.setting} startPlay={this.startPlay}/>
            )
        }else {
            return(
                <Gameplay data={this.state.data}/>
            )
        }
    }
}

export default Game
