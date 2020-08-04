import React from "react";
import { createUseStyles } from "react-jss";

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
	let viewportPosition = translator.globalToLocal(object.position);
	let classes = useStyles(viewportPosition);
	return (
		<div
			className={`${classes.gameObject} ${classes[object.type]} ${
				object.me ? classes.me : ""
			}`}
		></div>
	);
}
