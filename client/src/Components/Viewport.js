import React, { useState, useEffect, useRef } from "react";
import { createUseStyles } from "react-jss";
import GameObject from "./GameObject";
import Translator from "../other/translator.js";
import { socket } from "../util";

const useStyles = createUseStyles({
	viewport: {
		position: "absolute",
		border: "1px solid black",
		overflow: "hidden",
		width: props => props.width,
		height: props => props.height
	}
});

function Viewport(props) {
	const classes = useStyles(props),
		knownObjects = useRef(new Set()),
		seeingObjects = useRef(new Set()),
		translator = useRef(Translator(props.height, props.width)),
		[, rerender] = useState();
	useEffect(() => {
		function know(object) {
			knownObject.current.add(object);
		}
		function see({ id, position, movement }) {
			let knownObject = [...knownObjects.current].find(
				obj => obj.id == id
			);
			seeingObjects.current.add({
				__proto__: knownObject,
				position,
				movement
			});
			rerender();
		}
		socket.on("change movement", msg => {
			[...seeingObjects.current]
				.find(object => object.id == msg.id)
				.setMovement(msg);
		});
		socket.on("know", msg => known(msg));
		socket.on("see", msg => see(msg));
	}, []);
	const setTarget = event => {
		socket.emit(
			"movement target",
			translator.current.localToGlobal([event.clientX, event.clientY])
		);
	};

	return (
		<div className={classes.viewport} onClick={setTarget}>
			{[...seeingObjects.current].map(object => {
				return (
					<GameObject
						object={object}
						key={object.id}
						translator={translator.current}
					/>
				);
			})}
		</div>
	);
}

export default Viewport;
