import React, { useState, useEffect, useRef } from "react";
import { createUseStyles } from "react-jss";
import MovableObject from "./MovableObject.js";
import StaticObject from "./StaticObject.js";
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
		knownObjects = useRef(new Set(props.startKnowing)),
		seeingObjects = useRef(new Set(props.startSeeing)),
		translator = useRef(Translator(props.height, props.width)),
		[, rerender] = useState();
	useEffect(() => {
		function see({ id, position, movement }) {
			let knownObject = [...knownObjects.current].find(
				obj => obj.id == id
			);
			if(!knownObject) console.error('seeing unknown object')
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
		socket.on("know", msg => knownObject.add(msg));
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
				if(object.movement){
					return (
						<MovableObject
							object={object}
							key={object.id}
							translator={translator.current}
						/>
					);
				}else {
					return (
						<StaticObject
							object={object}
							key={object.id}
							translator={translator.current}
						/>
					);
				}	
			})}
		</div>
	);
}

export default Viewport;
