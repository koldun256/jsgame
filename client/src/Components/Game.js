import React, {useState, useEffect} from 'react'
import Gameplay from './Gameplay'
import Gamewait from './Gamewait'
import {socket} from '../util'

export default function Game(props){
    let [location, setLocation] = useState('wait')
    let [data, setData] = useState()
	console.log(props)
	useEffect(() => {
		socket.on('room start', msg => {
			console.log('afdbvz')
			console.log(msg)
			setData(msg)
			setLocation('play')
		})		
	}, [])
    if(location == 'wait'){
        return(
			<Gamewait data={props.setting} />
        )
    }else {
        return(
            <Gameplay data={data}/>
        )
    }
}
