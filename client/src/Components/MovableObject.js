import React, { useRef, useReducer, useEffect, useState, useContext } from 'react'
import GameObject from 'Components/GameObject.js'
import eachFrame from 'Other/frame.js'
import createMovement from 'Other/movement';
import {SocketContext} from 'Components/App';

export default function MovableObject({ objectData, translator }) {
	const [movement, setMovement] = useState(
		() => createMovement(objectData.movement)
	)
	let [position, move] = useReducer(movement, objectData.position)
	let mutablePosition = useRef()
	let socket = useContext(SocketContext)
	mutablePosition.current = position
	useEffect(() => {
		let movementChangeListener = ({id, movement}) => {
			if(objectData.id == id) {
				move('end')
				setMovement(() => createMovement(movement))
			}
		}
		socket.on('change movement', movementChangeListener)

		let clearFrame = eachFrame(() => {
			move('step')
			if(objectData.protagonist) translator.setCenter(mutablePosition.current)
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
				type: objectData.type,
				me: objectData.protagonist,
				position: position,
			}}
		/>
	)
}
