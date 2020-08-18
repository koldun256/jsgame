import React, { useState, useEffect } from 'react'
import ReactDOM from 'react-dom'
import Menu from 'Components/Menu'
import Game from 'Components/Game'
import { socket } from 'Other/util'

function Main() {
	let [location, setLocation] = useState('menu')
	let [gameSetting, setGameSetting] = useState()
	useEffect(() => {
		socket.on('response room enter', data => {
			setGameSetting(data)
			setLocation('game')
		})
	}, [])
	if (location == 'menu') {
		return <Menu />
	} else {
		return <Game setting={gameSetting} end={() => setLocation('menu')} />
	}
}

ReactDOM.render(<Main />, document.getElementById('root'))
