import React, { useState } from 'react'
import useSubscriber from '../Hooks/useSubscriber'

export default function Gamewait(props) {
	let [players, setPlayers] = useState(props.data.waiting)
	useSubscriber('socket@adding to waiting', newUser => {
		setPlayers(players.concat([newUser]))
	})

	return (
		<div>
			ждущие игроки:
			{players.map(player => (
				<div key={player.id}>
					{player.health}
					{player.name}
				</div>
			))}
		</div>
	)
}
