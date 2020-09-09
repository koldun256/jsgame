import { useContext, useReducer, useRef, useEffect } from 'react'
import useSubscriber from 'Hooks/useSubscriber'
import { TranslatorContext } from 'Components/Viewport'

function reducer(state, action) {
	if (action.type == 'set movement') {
		return {
			position: state.position,
			movement: {
				...action.movement,
				ended: false,
				direction: [
					action.movement.step[0] >= 0 ? 1 : -1,
					action.movement.step[1] >= 0 ? 1 : -1,
				],
			},
		}
	}
	if (action.type == 'step') {
		if (state.movement.ended) {
			return state
		}
		state.position[0] += state.movement.step[0]
		state.position[1] += state.movement.step[1]
		if (state.movement.end) {
			if (
				state.position[0] * state.movement.direction[0] >=
					state.movement.end[0] * state.movement.direction[0] ||
				state.position[1] * state.movement.direction[1] >=
					state.movement.end[1] * state.movement.direction[1]
			) {
				state.position = state.movement.end
				state.movement.ended = true
			}
		}
		return {...state}
	}
	if (action.type == 'teleport') {
		//return { position: action.position, end, step, direction, ended }
	}
}

function useMovement(startMovementData, startPosition, object) {
	const [state, dispatch] = useReducer(reducer, null, () =>
		reducer(
			{ position: startPosition },
			{ type: 'set movement', movement: startMovementData }
		)
	)
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
