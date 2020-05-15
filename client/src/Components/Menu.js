import React, {Component} from 'react'
import {socket} from '../util'
import Button from './Button'

class Menu extends Component {
    constructor(props){
        super(props)

        this.spells = [
          {
            "action": "stun",
            "props": [10],
            "selectors": [{"name": "others", "props": [], "selectors": []}]
          },
          {
            "action": "stun",
            "props": [10],
            "selectors": [{"name": "others", "props": [], "selectors": []}]
          },
          {
            "action": "stun",
            "props": [10],
            "selectors": [{"name": "others", "props": [], "selectors": []}]
          }
        ]

        this.connect = this.connect.bind(this)
        this.nameChange = this.nameChange.bind(this)

        socket.on('response room enter', function(data){
            console.log('server room enter responding data ', data)
            if(data.status == 'success'){
                this.props.game(data)
            }else {
                this.setState({error: data.error})
            }
        }.bind(this))

        this.state = {name: ''}
    }

    connect(){
        socket.emit('request room enter', {spells: this.spells, name: this.state.name})
    }

    nameChange(event){
        this.setState({name: event.target.value})
    }

    render(){
        return (
            <div className='menu'>
                <input value={this.state.name} onChange={this.nameChange}/>
                {this.state.error &&
                    <span>
                        {JSON.stringify(this.state.error)}
                    </span>
                }
                <Button click={this.connect} text='Присоеденится' />
            </div>
        );
    }
}

export default Menu
