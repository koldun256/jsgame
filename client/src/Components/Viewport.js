import React, { useMemo, createContext } from 'react'
import PropTypes from 'prop-types'
import { createUseStyles } from 'react-jss'
import eventSystem from 'Other/eventSystem'
import Translator from 'Other/translator'
import GameObject from 'Components/GameObject'
import backgroundUrl from 'Assets/img/bg.png'
import useGameObjects from 'Hooks/useGameObjects'
const useStyles = createUseStyles({
	viewport: {
		margin: 'auto',
		left: 'auto',
		right: 'auto',
		position: 'absolute',
		border: '1px solid black',
		overflow: 'hidden',
		width: '100vh',
		height: '100vh',
	},
})

export const TranslatorContext = createContext()

const defaultSeeing = [
	{
		position: [3000, 3000],
		display: 'img',
		img: backgroundUrl,
		size: [6000, 6000],
		id: 'bg',
		zIndex: -2,
	},
	{
		position: [0, 0],
		id: 'target',
		display: 'rect',
		size: [30, 30],
		color: '#edc917',
		zIndex: -1,
	},
]

function Viewport(props) {
	console.log(props)
	const translator = useMemo(
		() => Translator(document.documentElement.clientHeight, props.size),
		[]
	)
	const children = useGameObjects(props, defaultSeeing)
	const classes = useStyles(props)
	const setTarget = e => {
		let rect = e.target.getBoundingClientRect()
		let viewportPosition = [e.clientX - rect.left, e.clientY - rect.top]
		let globalPosition = translator.localToGlobal(viewportPosition)
		eventSystem.publish('socket-emit@movement target', globalPosition)
		eventSystem.publish('teleport', {
			id: 'target',
			position: globalPosition,
		})
	}
	return (
		<TranslatorContext.Provider value={translator}>
			<div className={classes.viewport} onClick={setTarget}>
				{children.map(child => (
					<GameObject {...child} key={child.id} />
				))}
			</div>
		</TranslatorContext.Provider>
	)
}

Viewport.propTypes = {
	size: PropTypes.number.isRequired,
	seeing: PropTypes.arrayOf(
		PropTypes.exact({
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
		})
	).isRequired,
}

export default Viewport
