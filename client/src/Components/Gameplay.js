import Viewport from 'Components/Viewport'
import Manabar from 'Components/Manabar'
import React from 'react'
import { createUseStyles } from 'react-jss'

const useStyles = createUseStyles({
	container: {
		display: 'flex',
		height: '100vh',
		width: '100vw',
	}
})

export default function Gameplay(props) {
	const classes = useStyles()
	return (
		<div className={classes.container}>
			<div>
				<Manabar start={1000} />
			</div>
			<div>
				<Viewport
					startSeeing={props.data.seeing}
					startKnowing={props.data.knowing}
					size={900}
				/>
			</div>
		</div>
	)
}
