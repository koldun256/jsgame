import React from 'react'
import usePosition from 'Hooks/usePosition'
import useDisplay from 'Hooks/useDisplay'

export default function GameObject(object) {
	const position = usePosition(object)
	const className = useDisplay({...object, position})

	return (
		<div
			className={className} >
			{position}
		</div>
	)
}
