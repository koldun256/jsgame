import React, {Component} from 'react'
import Menu from './Menu'
import Game from './Game'

class Main extends Component {
    constructor(props){
        super(props)

        this.gotoGame = this.gotoGame.bind(this)
        this.gotoMenu = this.gotoMenu.bind(this)

        this.state = {location: 'menu'}
    }
    gotoGame(setting){
        console.log('hii')
        this.setState({location: 'game', gameSetting: setting})
    }
    gotoMenu(){
        this.setState({location: 'menu'})
    }
    render(){
        if(this.state.location == 'menu'){
            console.log('1')
            return (
                <Menu game={this.gotoGame}/>
            )
        }else {
            console.log('2')
            return (
                <Game setting={this.state.gameSetting} end={this.gotoMenu}/>
            )
        }
    }
}

export default Main
