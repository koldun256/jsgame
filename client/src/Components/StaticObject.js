import GameObject from "./GameObject.js";
import React, { useState } from "react";
import {useFrame} from '../Hooks/useFrame.js'
export default function StaticObject({object, translator}) {
	let [, rerender] = useState()
	useFrame(rerender)
	return (
		<GameObject
			translator={translator}
			object={{
				type: object.type,
				me: object.me,
				position: object.position
			}}
		/>
	);
}
