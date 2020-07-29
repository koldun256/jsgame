import { useEffect, useState } from "react";
import { useMovement } from "../Hooks/useMovement";
import { createUseStyles } from "react-jss";
import { useFrame } from "../Hooks/useFrame";

const useStyles = createUseStyles({
	gameObject: {
		position: "absolute",
		transform: "translate(-50%, -50%)",
		left: position => position[0],
		top: position => position[1]
	},
	player: {
		backgroundColor: "red",
		width: 50,
		height: 50
	},
	me: {
		backgroundColor: "blue"
	},
	bg: {
		width: 6000,
		height: 6000,
		backgroundImage: "url(graphic/bg.png)"
	},
	base: {
		width: 100,
		height: 100,
		backgroundColor: "grey"
	}
});

export default function GameObject({ object, translator }) {
	let [movement, setMovement] = useState(objects.movement);
	let [position, step] = useMovement(object.position, object.movement);

	let viewportPosition = translator.globalToLocal(position);
	let classes = useStyles(viewportPosition);
	useEffect(() => {
		if (object.type == "player") object.setMovement = setMovement;
	}, []);
	useFrame(() => {
		if (object.type == "player") {
			step();
			if (object.me) translator.setCenter(position);
		}
	});

	return (
		<div
			className={`${classes.gameObject} ${classes[object.type]} ${
				object.me ? classes.me : ""
			}`}
		></div>
	);
}
