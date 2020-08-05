import React, { useRef, useReducer } from "react";
import GameObject from "Components/GameObject.js";
import createMovementReducer from "Other/movement.js";
import nextFrame from "Other/frame.js";
export default function MovableObject({ object, translator }) {
	let movementReducer = useRef(createMovementReducer(object.movement));
	let [position, step] = useReducer(movementReducer.current, object.position);
	object.setMovement = newMovement => {
		movementReducer.current = createMovementReducer(newMovement);
	};
	nextFrame(() => {
		step();
		if (object.protagonist) translator.setCenter(position);
	});
	return (
		<GameObject
			translator={translator}
			object={{
				type: object.type,
				me: object.protagonist,
				position: position
			}}
		/>
	);
}
