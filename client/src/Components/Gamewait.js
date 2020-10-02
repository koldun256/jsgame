import React, { useState } from 'react'
import useSubscriber from '../Hooks/useSubscriber'
import PropTypes from 'prop-types'

export default function Gamewait(props) {
	console.log(props)
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

Gamewait.propTypes = {
	data: PropTypes.exact({
		id: PropTypes.string.isRequired,
		waiting: PropTypes.arrayOf(
			PropTypes.exact({
				id: PropTypes.string.isRequired,
				team: PropTypes.string.isRequired,
				name: PropTypes.string.isRequired,
			})
		).isRequired,
	}),
}
