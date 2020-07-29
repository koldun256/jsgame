import Viewport from "./Viewport";

export default function Gameplay(props) {
	return (
		<div>
			<Viewport
				startSeeing={props.data.seeing}
				startKnowing={props.data.players}
				width="900"
				height="900"
			/>
		</div>
	);
}
