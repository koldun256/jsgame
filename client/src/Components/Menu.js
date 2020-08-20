import React, { useState, useContext } from "react";
import { socket } from "Other/util";
import Button from "Components/Button";
import {SocketContext} from "Components/App";

const defaultSpells = [
	{
		action: "stun",
		props: [10],
		selectors: [{ name: "others", props: [], selectors: [] }]
	},
	{
		action: "stun",
		props: [10],
		selectors: [{ name: "others", props: [], selectors: [] }]
	},
	{
		action: "stun",
		props: [10],
		selectors: [{ name: "others", props: [], selectors: [] }]
	}
];

export default function Menu() {
	let [name, setName] = useState("");
	let socket = useContext(SocketContext)

	let requestEnter = () => socket.emit("request room enter", {
			spells: defaultSpells,
			name: name
		})

	return (
		<div className="menu">
			<input
				value={name}
				onChange={event => setName(event.target.value)}
			/>
			<Button
				click={requestEnter}
				text="Присоеденится"
			/>
		</div>
	);
}
