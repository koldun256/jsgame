import React, {Component} from 'react'
import {socket} from '../util'

function setupSocket(props){
    console.log('AaAaAaAaaA')
    socket.on('room start', function(data){
        console.log('room start')
        props.startPlay(data)
    })
}
class Gamewait extends Component {
    constructor(props){
        super(props)
        this.state = {
            players: props.data.room.waiting
        }
        setupSocket(props)
    }
    render(){
        return (
            <div>
                ждущие игроки:
                {this.state.players.map(player =>
                    <div key={player.id}>
                        {player.name}
                    </div>
                )}
            </div>
        )
    }
}

export default Gamewait
