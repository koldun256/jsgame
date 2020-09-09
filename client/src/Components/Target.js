import React from 'react'
import GameObject from 'Components/GameObject';

function Target() {
	return (
		<GameObject
			object={{
				position: [0,0],
				id: 'target',
				type: 'target',
				movement: { startPosition: [0,0], step: [0, 0]},
			}}
		/>
	)
}

export default Target
