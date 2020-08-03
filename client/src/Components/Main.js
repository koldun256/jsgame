import React, {useState, useEffect} from 'react'
import Menu from './Menu'
import Game from './Game'
import {socket} from '../util'

export default function Main(props){
    let [location, setLocation] = useState('menu')
    let [gameSetting, setGameSetting] = useState()
	useEffect(() => {
		socket.on("response room enter", data => {
			setGameSetting(data)
			setLocation('game')
		})
	}, []);
	console.log(gameSetting)
    if(location == 'menu'){
        return (
            <Menu/>
        )
    }else {
        return (
            <Game setting={gameSetting} end={() => setLocation('menu')}/>
        )
    }
}
