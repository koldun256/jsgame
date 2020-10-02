import Viewport from 'Components/Viewport'
import Manabar from 'Components/Manabar'
import React from 'react'
import PropTypes from 'prop-types'
import { createUseStyles } from 'react-jss'

const useStyles = createUseStyles({
	container: {
		display: 'flex',
		height: '100vh',
		width: '100vw',
	},
})

export default function Gameplay(props) {
	const classes = useStyles()
	console.log(props)
	return (
		<div className={classes.container}>
			<div>
				<Manabar start={1000} />
			</div>
			<div>
				<Viewport seeing={props.data.seeing} size={900} />
			</div>
		</div>
	)
}

Gameplay.propTypes = {
	data: PropTypes.exact({
		seeing: PropTypes.arrayOf(
			PropTypes.exact({
				display: PropTypes.oneOf(['rect', 'ring', 'img']).isRequired,
				id: PropTypes.string.isRequired,
				position: PropTypes.arrayOf(PropTypes.number).isRequired,
				size: PropTypes.arrayOf(PropTypes.number).isRequired,
				movement: PropTypes.exact({
					step: PropTypes.arrayOf(PropTypes.number).isRequired,
					startPosition: PropTypes.arrayOf(PropTypes.number)
						.isRequired,
				}),
				color: PropTypes.string,
				img: PropTypes.string,
				protagonist: PropTypes.bool,
			})
		).isRequired,
	}).isRequired,
}
