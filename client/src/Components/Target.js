import React, { useState } from 'react'
import GameObject from 'Components/GameObject';
import useSubscriber from 'Hooks/useSubscriber';

function Target() {
	const [position, setPosition] = useState([0, 0])
	useSubscriber('target', target => {
		console.log('asd', target);
		setPosition(target)
	})
	console.log(position);
	return (
		<GameObject
			object={{
				position,
				id: 'target',
				type: 'target',
				movement: { step: [0, 0], end: [Infinity, Infinity] },
			}}
		/>
	)
}

export default Target
