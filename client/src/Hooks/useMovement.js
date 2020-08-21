import { useEffect, useContext, useReducer, useRef, useState } from 'react'
import { SocketContext } from 'Components/App'
import { TranslatorContext } from 'Components/Viewport'
import eachFrame from 'Other/frame'
//import useMutableState from 'Hooks/useMutableState'

function MovementReducer({ step, end: target }) {
	let direction = [step[0] >= 0 ? 1 : -1, step[1] >= 0 ? 1 : -1]

	return (position, action) => {
		if (action == 'end') {
			return target || position
		}

		let newPosition = [position[0] + step[0], position[1] + step[1]]

		if (
			target &&
			newPosition[0] * direction[0] >= target[0] * direction[0] &&
			newPosition[1] * direction[1] >= target[1] * direction[1]
		)
			return target || position

		return newPosition
	}
}

function useMovement(startMovementData, startPosition, object) {
	const [movementReducer, setMovementReducer] = useState(() =>
		MovementReducer(startMovementData)
	)
	const [position, move] = useReducer(
		//(...args) => movementReducer.current(...args),
		movementReducer /*.current*/,
		startPosition
	)
	const mutablePosition = useRef(startPosition)
	mutablePosition.current = position
	const socket = useContext(SocketContext)
	const translator = useContext(TranslatorContext)

	useEffect(() => {
		let clearFrame = eachFrame(() => {
			move('step')
			if (object.protagonist)
				translator.setCenter(mutablePosition.current)
		})
		let movementChangeListener = msg => {
			if (msg.id == object.id) {
				move('end')
				setMovementReducer(() => MovementReducer(msg.movement))
			}
		}
		socket.on('change movement', movementChangeListener)

		return () => {
			clearFrame()
			socket.off('change movement', movementChangeListener)
		}
	}, [])
	return position
}

export default useMovement
