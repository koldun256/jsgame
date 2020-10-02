import React, { useState } from 'react'
import PropTypes from 'prop-types'
import Gameplay from 'Components/Gameplay'
import Gamewait from 'Components/Gamewait'
import useSubscriber from 'Hooks/useSubscriber'

export default function Game(props) {
	let [location, setLocation] = useState('wait')
	let [data, setData] = useState()
	useSubscriber('socket@room start', msg => {
		setData(msg)
		setLocation('play')
	})
	if (location == 'wait') {
		return <Gamewait data={props.setting} />
	} else {
		return <Gameplay data={data} />
	}
}

Game.propTypes = {
	end: PropTypes.func.isRequired,
	setting: PropTypes.exact({
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
