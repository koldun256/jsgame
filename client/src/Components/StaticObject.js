import Object from "./GameObject.js";
import { useState } from "react";
import {useFrame} from '../Hooks/useFrame.js'
export default function StaticObject({object, translator}) {
	let [, rerender] = useState()
	useFrame(rerender)
	return (
		<Object
			translator={translator}
			object={{
				type: object.type,
				me: object.me,
				position: object.position
			}}		
		/>
	);
}
