import React, { useRef, useReducer, useEffect, useState } from 'react'
import GameObject from 'Components/GameObject.js'
import eachFrame from 'Other/frame.js'
import { socket } from 'Other/util.js'
import createMovement from 'Other/movement';

export default function MovableObject({ object, translator }) {
	const [movement, setMovement] = useState(
		() => createMovement(object.movement)
	)
	let [position, move] = useReducer(movement, object.position)
	let mutablePosition = useRef()
	mutablePosition.current = position
	useEffect(() => {
		let movementChangeListener = ({id, movement}) => {
			if(object.id == id) {
				move('end')
				setMovement(() => createMovement(movement))
			}
		}
		socket.on('change movement', movementChangeListener)

		let clearFrame = eachFrame(() => {
			move('step')
			if(object.protagonist) translator.setCenter(mutablePosition.current)
		})

		return () => {
			socket.off('change movement', movementChangeListener)
			clearFrame()
		}
	}, [])
	
	return (
		<GameObject
			translator={translator}
			object={{
				type: object.type,
				me: object.protagonist,
				position: position,
			}}
		/>
	)
}
