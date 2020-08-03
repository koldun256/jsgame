import GameObject from "./GameObject.js";
import React, { useRef, useState} from "react";
import { useMovement } from "../Hooks/useMovement.js";
import {useFrame} from '../Hooks/useFrame.js'
export default function MovableObject({object, translator}) {
	let movement = useRef(object.movement)
	console.log('reloading movable, movement: ', movement.current)
	let [position, step] = useMovement(object.position, movement.current);
	let [, rerender] = useState()
	object.setMovement = newMovement => {
		console.log(newMovement)
		movement.current = newMovement
		rerender({})
	}
	useFrame(() => {
		console.log('frame with step')
		step()
		if(object.me) translator.setCenter(position)
	})
	return (
		<GameObject
			translator={translator}
			object={{
				type: object.type,
				me: object.me,
				position: position  
			}}
		/>
	);
}
