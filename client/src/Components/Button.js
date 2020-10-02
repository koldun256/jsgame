import React from 'react'

export default function Button(props) {
	return (
		<button className="btn btn-2" onClick={props.click}>
			<div>{props.text}</div>
		</button>
	)
}
