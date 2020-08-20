import React, {useState, useEffect, useContext} from 'react'
import Gameplay from 'Components/Gameplay'
import Gamewait from 'Components/Gamewait'
import {SocketContext} from 'Components/App'

export default function Game(props){
    let [location, setLocation] = useState('wait')
    let [data, setData] = useState()
	let socket = useContext(SocketContext)
	useEffect(() => {
		socket.on('room start', msg => {
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
