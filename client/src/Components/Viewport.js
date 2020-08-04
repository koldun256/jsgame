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
		width: props => props.width+'px',
		height: props => props.height+'px'
	}
});

function Viewport(props) {
	const classes = useStyles(props),
		knownObjects = useRef(new Set(props.startKnowing)),
		seeingObjects = useRef(new Set()),
		translator = useRef(Translator(props.height, props.width)),
		[, rerender] = useState();

	function see({ id, position, movement }) {
		if([...seeingObjects.current].some(object => object.id == id))
			return console.error('seeing seen object')
		let knownObject = [...knownObjects.current].find(
			obj => obj.id == id
		);
		if(!knownObject) return console.error('seeing unknown object')
		seeingObjects.current.add({
			__proto__: knownObject,
			position,
			movement
		});
		rerender({});
	}
	useEffect(() => {
		seeingObjects.current.add({
			type: 'bg',
			id: 'bg',
			position: [3000, 3000]
		})
		props.startSeeing.forEach(see)
		socket.on("change movement", ({id, movement}) => {
			console.log(movement.step)
			return [...seeingObjects.current]
				.find(object => object.id == id)
				.setMovement(movement);
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
				if(object.protagonist) translator.current.setCenter([...object.position])
				if(object.movement){
					console.log(object.id)
					return (
						<MovableObject
							object={object}
							key={object.id}
							translator={translator.current}
						/>
					);
				}else {
					console.log(object.id)
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
