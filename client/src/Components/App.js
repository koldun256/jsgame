import React, { useState, useEffect, createContext } from 'react'
import ReactDOM from 'react-dom'
import Menu from 'Components/Menu'
import Game from 'Components/Game'
import 'Assets/relaxCSS.css'
import 'Other/socket'
import 'Other/frame'
import useSubscriber from '../Hooks/useSubscriber'


function App() {
	let [location, setLocation] = useState('menu')
	let [gameSetting, setGameSetting] = useState()
	useSubscriber('socket@response room enter', data => {
		setGameSetting(data)
		setLocation('game')
	})
	if (location == 'menu') {
		return <Menu />
	} else {
		return <Game setting={gameSetting} end={() => setLocation('menu')} />
	}
}

ReactDOM.render(<App />, document.getElementById('root'))
