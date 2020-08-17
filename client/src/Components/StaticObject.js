import React, { useState, useEffect } from "react";
import GameObject from "Components/GameObject.js";
import eachFrame from "Other/frame.js";

export default function StaticObject({ object, translator }) {
	let [, rerender] = useState();

	useEffect(() => {
		let clearFrames = eachFrame(() => rerender({}))
		return clearFrames
	}, [])

	return (
		<GameObject
			translator={translator}
			object={{
				type: object.type,
				me: object.protagonist,
				position: object.position
			}}
		/>
	);
}
