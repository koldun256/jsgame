import React, { useState, useEffect } from "react";
import { socket } from "../util";
import Button from "./Button";

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

export default function Menu(props) {
	let [name, setName] = useState("");
	let [error, setError] = useState();

	useEffect(() => {
		socket.on("response room enter", data => {
			if (data.status == "success") {
				props.game(data);
			} else {
				setError(data.error);
			}
		});
	}, []);

	return (
		<div className="menu">
			<input
				value={name}
				onChange={event => setName(event.target.value)}
			/>
			{error && <span>{JSON.stringify(error)}</span>}
			<Button
				click={() =>
					socket.emit("request room enter", {
						spells: defaultSpells,
						name: name
					})
				}
				text="Присоеденится"
			/>
		</div>
	);
}
