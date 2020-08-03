import React, {useState} from 'react'
import {socket} from '../util'

export default function Gamewait(props){
	console.log(props)
    let [players, setPlayers] = useState(props.data.waiting)

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
