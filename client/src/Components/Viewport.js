import React, {
	useState,
	useEffect,
	useRef,
	useMemo,
	createContext,
} from 'react'
import { createUseStyles } from 'react-jss'
import eventSystem from 'Other/eventSystem';
import Translator from 'Other/translator.js'
import GameObject from 'Components/GameObject'
import Target from 'Components/Target'
import useSubscriber from 'Hooks/useSubscriber'

const useStyles = createUseStyles({
	viewport: {
		margin: 'auto',
		left: 'auto',
		right: 'auto',
		position: 'absolute',
		border: '1px solid black',
		overflow: 'hidden',
		width: '100vh',
		height: '100vh',
	},
})

export const TranslatorContext = createContext()

const defaultSeeing = [
	<GameObject
		object={{
			type: 'bg',
			position: [3000, 3000],
			id: 'bg',
			movement: { step: [0, 0], end: [Infinity, Infinity] },
		}}
		key="bg"
	/>,
	<Target key='target'/>,
]

function Viewport(props) {
	const classes = useStyles(props),
		knownObjects = useRef(new Set(props.startKnowing)),
		translator = useMemo(() => {
			return Translator(document.documentElement.clientHeight, props.size)
		}, []),
		seeingObjects = useRef(new Set(defaultSeeing)),
		[, rerender] = useState()

	function see({ id, position, movement }) {
		console.log('seeing');
		let knownObject = [...knownObjects.current].find(obj => obj.id == id)
		if (!knownObject) return console.error('seeing unknown object')
		let objectData = {
			__proto__: knownObject,
			position,
			movement: movement || {step:[0,0]}
		}
		seeingObjects.current.add(
			<GameObject object={objectData} key={objectData.id} />
		)
		rerender({})
	}

	useEffect(() => {
		props.startSeeing.forEach(see)
	}, [])

	useSubscriber('socket@know', object => knownObjects.add(object))
	useSubscriber('socket@see', see)

	const setTarget = e => {
		let rect = e.target.getBoundingClientRect()
		let viewportPosition = [e.clientX - rect.left, e.clientY - rect.top]
		let globalPosition = translator.localToGlobal(viewportPosition)
		eventSystem.publish('socket-emit@movement target', globalPosition)
		eventSystem.publish('target', globalPosition)
	}
	let children = [...seeingObjects.current]
	return (
		<TranslatorContext.Provider value={translator}>
			<div className={classes.viewport} onClick={setTarget}>
				{children}
			</div>
		</TranslatorContext.Provider>
	)
}

export default Viewport
