import Object from "./GameObject.js";
import { useState } from "react";
import { useMovement } from "../Hooks/useMovement.js";
import {useFrame} from '../Hooks/useFrame.js'
export default function MovableObject({object, translator}) {
	let [movement, setMovement] = useState(object.movement);
	let [position, step] = useMovement(object.position, movement);
	object.setMovement = setMovement
	object.useFrame(() => {
		step()
		if(object.me) translator.setCenter(position)
	})
	return (
		<Object
			translator={translator}
			object={{
				type: object.type,
				me: object.me,
				position: position  
			}}
		/>
	);
}
