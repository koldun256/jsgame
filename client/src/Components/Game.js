import React, {useState, useEffect, useContext} from 'react'
import Gameplay from 'Components/Gameplay'
import Gamewait from 'Components/Gamewait'
import useSubscriber from 'Hooks/useSubscriber'

export default function Game(props){
	let [location, setLocation] = useState('wait')
	let [data, setData] = useState()
	useSubscriber('socket@room start', msg => {
		setData(msg)
		setLocation('play')
	})
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
