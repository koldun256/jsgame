import Viewport from "./Viewport";
import React from 'react'

export default function Gameplay(props) {
	console.log(props)
	return (
		<div>
			<Viewport
				startSeeing={props.data.seeing}
				startKnowing={props.data.knowing}
				width="900"
				height="900"
			/>
		</div>
	);
}
