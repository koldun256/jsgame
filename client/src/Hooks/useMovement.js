import { useContext, useReducer, useRef, useEffect } from 'react'
import useSubscriber from 'Hooks/useSubscriber'
import { TranslatorContext } from 'Components/Viewport'

function reducer(state, action) {
	if (action.type == 'set movement') {
		console.log(action.movement);
		return {
			position: action.movement.startPosition || state.position,
			movement: action.movement,
		}
	}
	if (action.type == 'step') {
		state.position[0] += state.movement.step[0]
		state.position[1] += state.movement.step[1]
		
		return {...state}
	}
	if (action.type == 'teleport') {
		state.position = action.position
		return {...state}
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
	useSubscriber('teleport', ({id, position}) => {
		if(id == object.id) dispatch({type: 'teleport', position})
	})
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
