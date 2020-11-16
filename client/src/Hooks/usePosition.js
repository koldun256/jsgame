import { useContext, useReducer } from 'react'
import useSubscriber from 'Hooks/useSubscriber'
import useCallback from 'Hooks/useCallback';
import { TranslatorContext } from 'Components/Viewport'

function reducer(state, action) {
	if (action.type == 'set movement') {
		return {
			position: action.movement.startPosition || state.position,
			step: action.movement.step,
		}
	}
	if (action.type == 'step') {
		return {
			position: [
				state.position[0] + state.step[0],
				state.position[1] + state.step[1],
			],
			step: state.step,
		}
	}
	if (action.type == 'teleport') {
		return {
			position: action.position,
			step: [0, 0],
		}
	}
}

function usePosition(object) {
	const movement = object.movement || { step: [0, 0] }
	const [state, dispatch] = useReducer(reducer, {
		position: object.position,
		step: movement.step,
	})
	const translator = useContext(TranslatorContext)
	useSubscriber('teleport', ({ id, position }) => {
		if (id == object.id) dispatch({ type: 'teleport', position })
	})
	const onFrame = useCallback(() => {
		dispatch({ type: 'step' })
		if (object.protagonist) {
			translator.setCenter(state.position)
		}
	})
	useSubscriber( 'frame', onFrame)
	useSubscriber('socket@change movement', msg => {
		if (msg.id == object.id) {
			console.log('changing movement')
			dispatch({ type: 'set movement', movement: msg.movement })
		}
	})

	return state.position
}

export default usePosition
