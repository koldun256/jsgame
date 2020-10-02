import React, { useState } from 'react'
import PropTypes from 'prop-types'
import useSubscriber from 'Hooks/useSubscriber'
import { createUseStyles } from 'react-jss'

const manaRegen = 10
const maxMana = 2000

const useStyles = createUseStyles({
	bar: {
		border: '1px solid black',
		backgroundColor: '#808080',
		height: 30,
		width: 100,
	},
	content: {
		backgroundColor: ({ adding }) => (adding ? '#0050FF' : '#0000FF'),
		height: '100%',
		width: ({ mana }) => (mana / maxMana) * 100 + '%',
	},
})

function Manabar(props) {
	const [adding, setAdding] = useState(false)
	const [mana, setMana] = useState(props.start)
	const classes = useStyles({ mana, adding })
	useSubscriber('socket@mana start', () => {
		console.log('enter mana')
		setAdding(true)
	})
	useSubscriber('socket@mana end', () => setAdding(false))
	useSubscriber(
		'frame',
		() => {
			if (adding)
				setMana(mana => {
					if (mana + manaRegen >= maxMana) return maxMana
					return mana + manaRegen
				})
		},
		[adding]
	)
	return (
		<div className={classes.bar}>
			<div className={classes.content}></div>
		</div>
	)
}

Manabar.propTypes = {
	start: PropTypes.number.isRequired,
}

export default Manabar
