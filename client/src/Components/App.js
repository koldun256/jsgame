import React, { useState, useEffect, createContext } from 'react'
import ReactDOM from 'react-dom'
import Menu from 'Components/Menu'
import Game from 'Components/Game'
import io from 'socket.io-client'

const socket = io.connect('http://127.0.0.1:5000')
export const SocketContext = createContext(socket)

function App() {
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

ReactDOM.render(<App />, document.getElementById('root'))
