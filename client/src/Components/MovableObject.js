import GameObject from "./GameObject.js";
import React, { useRef, useState} from "react";
import { useMovement } from "../Hooks/useMovement.js";
import {useFrame} from '../Hooks/useFrame.js'
export default function MovableObject({object, translator}) {
	let movement = useRef(object.movement)
	let [position, step] = useMovement(object.position, movement.current);
	object.setMovement = newMovement => {
		movement.current = newMovement
	}
	useFrame(() => {
		step()
		if(object.protagonist) translator.setCenter(position)
	})
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
