import React, { useState } from 'react'
import Button from 'Components/Button'
import eventSystem from 'Other/eventSystem'
import { createUseStyles } from 'react-jss'

const useStyles = createUseStyles({
	card: {
		position: 'absolute',
		//height: 400,
		width: 300,
		transform: 'translate(-50%, -50%)',
		top: '50vh',
		left: '50vw',
		backgroundColor: '#D0D0D0',
	},
})

const defaultSpells = [
	{
		action: 'stun',
		props: [10],
		selectors: [{ name: 'others', props: [], selectors: [] }],
	},
	{
		action: 'stun',
		props: [10],
		selectors: [{ name: 'others', props: [], selectors: [] }],
	},
	{
		action: 'stun',
		props: [10],
		selectors: [{ name: 'others', props: [], selectors: [] }],
	},
]

export default function Menu() {
	let [name, setName] = useState('')
	let classes = useStyles()

	let requestEnter = () => {
		eventSystem.publish('socket-emit@request room enter', {
			spells: defaultSpells,
			name: name,
		})
	}

	return (
		<div className={`${classes.card} border rounded shadow stacked-center`}>
			<input
				value={name}
				onChange={event => setName(event.target.value)}
			/>
			<Button click={requestEnter} text="Присоеденится" />
		</div>
	)
}
