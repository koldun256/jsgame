import { useContext, useReducer, useRef, useEffect } from 'react'
import useSubscriber from 'Hooks/useSubscriber'
import { TranslatorContext } from 'Components/Viewport'

function reducer({ position, end, step, direction, ended }, action) {
	if (action.type == 'set movement') {
		return {
			position: end || position,
			...action.movement,
			direction: [
				action.movement.step[0] >= 0 ? 1 : -1,
				action.movement.step[1] >= 0 ? 1 : -1,
			],
			ended: false,
		}
	}
	if (action.type == 'step') {
		let newPosition = position
		if (ended) {
			newPosition = end || position
		} else {
			newPosition = [position[0] + step[0], position[1] + step[1]]
			if (
				end &&
				newPosition[0] * direction[0] >= end[0] * direction[0] &&
				newPosition[1] * direction[1] >= end[1] * direction[1]
			) {
				return {
					position: end || position,
					ended: true,
					step,
					direction,
					end,
				}
			}
		}
		return { position: newPosition, ended, step, direction, end }
	}
	if (action.type == 'teleport') {
		return { position: action.position, end, step, direction, ended }
	}
}

function useMovement(startMovementData, startPosition, object) {
	const [state, dispatch] = useReducer(reducer, null, () =>
		reducer(
			{ position: startPosition },
			{ type: 'set movement', movement: startMovementData }
		)
	)
	console.log(state);
	//useEffect(() => dispatch({ action: 'teleport', position: startPosition }), [
		//startPosition,
	//])
	const mutablePosition = useRef()
	mutablePosition.current = state.position
	const translator = useContext(TranslatorContext)
	useSubscriber('frame', () => {
		dispatch({ type: 'step' })
		if (object.protagonist) translator.setCenter(mutablePosition.current)
	})
	useSubscriber('socket@change movement', msg => {
		if (msg.id == object.id) {
			console.log('changing movement')
			dispatch({ type: 'set movement', movement: msg.movement })
		}
	})

	return state.position
}

export default useMovement
