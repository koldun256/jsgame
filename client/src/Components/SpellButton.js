import React from 'react'
import {publish} from 'Other/eventSystem'
//import PropTypes from 'prop-types]' 
import {createUseStyles} from 'react-jss'

const size = 100

const useStyles = createUseStyles({
	button: {
		order: props => props.number,
		padding: 20,
		border: '4px solid black',
		width: size,
		height: size
	}
})

function SpellButton(props){
	const onPress = () => {
		publish('socket-emit@cast', props.number)
	}
	const classes = useStyles(props)

	return <div className={classes.button}>
		{props.number}
	</div>
}



export default SpellButton
