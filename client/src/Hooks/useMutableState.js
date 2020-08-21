import { useState, useRef } from 'react'

function useMutableState(startValue) {
	const [value, setValue] = useState(startValue)
	const mutableValue = useRef()
	mutableValue.current = value
	return [mutableValue, setValue]
}

export default useMutableState
