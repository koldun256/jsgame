import React, { useContext } from 'react'
import { createUseStyles } from 'react-jss'
import bgImage from 'Assets/img/bg.png'
import { TranslatorContext } from 'Components/Viewport'
import useMovement from '../Hooks/useMovement'

const useStyles = createUseStyles({
	gameObject: {
		position: 'absolute',
		transform: 'translate(-50%, -50%)',
		left: ({ position }) => position[0],
		top: ({ position }) => position[1],
		pointerEvents: 'none',
	},
	player: ({ translator }) => ({
		width: translator.getSize(50),
		height: translator.getSize(50),
		backgroundColor: 'red',
	}),
	me: {
		backgroundColor: '#0000FF !important',
	},
	bg: ({ translator }) => ({
		width: translator.getSize(6000),
		height: translator.getSize(6000),
		backgroundImage: `url(${bgImage})`,
	}),
	base: ({ translator }) => ({
		width: translator.getSize(100),
		height: translator.getSize(100),
		backgroundColor: 'grey',
	}),
	target: ({ translator }) => ({
		width: translator.getSize(20),
		height: translator.getSize(20),
		border: '2px solid red',
	}),
	manaZone: ({translator}) => ({
		width: translator.getSize(1000),
		height: translator.getSize(1000),
		borderRadius: '50%',
		border: translator.getSize(150)+'px solid teal'
	})
})

export default function GameObject({ object }) {
	let position = useMovement(object.movement, object.position, object)

	let translator = useContext(TranslatorContext)
	let viewportPosition = translator.globalToLocal(position)
	let classes = useStyles({ position: viewportPosition, translator })
	return (
		<div
			className={`${classes.gameObject} ${classes[object.type]} ${
				object.protagonist ? classes.me : ''
			}`}
		>{position}</div>
	)
}
