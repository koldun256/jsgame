import React, {useState, useEffect, useContext} from 'react'
import {SocketContext} from 'Components/App.js'

export default function Gamewait(props){
    let [players, setPlayers] = useState(props.data.waiting)
	let socket = useContext(SocketContext)
	useEffect(() => {
		socket.on('adding to waiting', newUser => {
			setPlayers(players.concat([newUser]))
		})
	}, [])

    return (
        <div>
            ждущие игроки:
            {players.map(player =>
                <div key={player.id}>
                    {player.health}
                    {player.name}
                </div>
            )}
        </div>
    )
}
