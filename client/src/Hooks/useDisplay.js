import {TranslatorContext} from 'Components/Viewport';
import {useContext} from 'react'
import {createUseStyles} from 'react-jss';

const useStyles = createUseStyles({
	object: {
		position: 'absolute',
		transform: 'translate(-50%, -50%)',
		pointerEvents: 'none',
		left: object => object.position[0],
		top: object => object.position[1],
		width: object => object.size[0],
		height: object => object.size[1],
		zIndex: object => object.zIndex || 'auto'
	},
	img: {
		backgroundImage: object => `url(${object.img})`
	},
	rect: {
		backgroundColor: object => object.color
	},
	ring: {
		borderRadius: '50%',
		border: object => `${object.width}px solid ${object.color}`
	}
})

function useDisplay(object) {
	const translator = useContext(TranslatorContext)
	const size = translator.getSize(object.size)
	const position = translator.globalToLocal(object.position)
	const classes = useStyles({...object, size, position})
	return `${classes[object.display]} ${classes.object}`
}

export default useDisplay
