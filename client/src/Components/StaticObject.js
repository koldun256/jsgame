import React, { useState } from "react";
import GameObject from "Components/GameObject.js";
import nextFrame from "Other/frame.js";

export default function StaticObject({ object, translator }) {
	let [, rerender] = useState();
	nextFrame(() => rerender({}));

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
