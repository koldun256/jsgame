import React from 'react'
import {createUseStyles} from 'react-jss'

const useStyles = createUseStyles({
    button: {
        backgroundColor: 'green',
        width: 110,
        height: 35,
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        textAlign: 'center'
    }
})

export default function Button(props){
    let classes = useStyles()
    return (
        <div className={classes.button} onClick={props.click}>
            <div>{props.text}</div>
        </div>
    )
}
