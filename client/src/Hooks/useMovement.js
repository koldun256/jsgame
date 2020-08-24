import { useContext, useReducer, useRef, useState, useEffect } from 'react'
import useSubscriber from 'Hooks/useSubscriber'
import { TranslatorContext } from 'Components/Viewport'

function MovementReducer({ step, end: target }) {
	let direction = [step[0] >= 0 ? 1 : -1, step[1] >= 0 ? 1 : -1]

	return (position, action) => {
		if (action.type == 'end') {
			return target || position
		}
		if (action.type == 'set') {
			return action.position
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
		movementReducer /*.current*/,
		startPosition,
	)
	useEffect(() => move({type: 'set', position: startPosition}), startPosition)
	const mutablePosition = useRef(startPosition)
	mutablePosition.current = position
	const translator = useContext(TranslatorContext)
	useSubscriber('frame', () => {
		move({type: 'step'})
		if (object.protagonist)
			translator.setCenter(mutablePosition.current)
	})
	useSubscriber('socket@change movement', msg => {
		if (msg.id == object.id) {
			move({type: 'end'})
			setMovementReducer(() => MovementReducer(msg.movement))
		}
	})

	return position
}

export default useMovement
