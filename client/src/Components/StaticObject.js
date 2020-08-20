import React, { useState, useEffect } from "react";
import GameObject from "Components/GameObject.js";
import eachFrame from "Other/frame.js";

export default function StaticObject({ objectData }) {
	let [, rerender] = useState();

	useEffect(() => {
		let clearFrames = eachFrame(() => rerender({}))
		return clearFrames
	}, [])

	return (
		<GameObject
			object={{
				type: objectData.type,
				me: objectData.protagonist,
				position: objectData.position
			}}
		/>
	);
}
