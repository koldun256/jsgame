import React, { useState } from "react";
import { socket } from "Other/util";
import Button from "Components/Button";

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

	return (
		<div className="menu">
			<input
				value={name}
				onChange={event => setName(event.target.value)}
			/>
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
