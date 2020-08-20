import Viewport from "Components/Viewport";
import React from 'react'

export default function Gameplay(props) {
	return (
		<div>
			<Viewport
				startSeeing={props.data.seeing}
				startKnowing={props.data.knowing}
				size={900}
			/>
		</div>
	);
}
