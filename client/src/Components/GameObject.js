import React from 'react'
import usePosition from 'Hooks/usePosition'
import useDisplay from 'Hooks/useDisplay'
import PropTypes from 'prop-types'

export default function GameObject(props) {
	const position = usePosition(props)
	const className = useDisplay({ ...props, position })

	return <div className={className}>{position}</div>
}

GameObject.propTypes = {
	display: PropTypes.oneOf(['rect', 'ring', 'img']).isRequired,
	id: PropTypes.string.isRequired,
	position: PropTypes.arrayOf(PropTypes.number).isRequired,
	size: PropTypes.arrayOf(PropTypes.number).isRequired,
	movement: PropTypes.exact({
		step: PropTypes.arrayOf(PropTypes.number).isRequired,
		startPosition: PropTypes.arrayOf(PropTypes.number).isRequired,
	}),
	color: PropTypes.string,
	img: PropTypes.string,
	protagonist: PropTypes.bool,
}
