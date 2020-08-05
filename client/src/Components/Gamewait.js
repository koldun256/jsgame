import React, {useState, useEffect} from 'react'
import {socket} from 'Other/util'

export default function Gamewait(props){
	console.log(props)
    let [players, setPlayers] = useState(props.data.waiting)
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
