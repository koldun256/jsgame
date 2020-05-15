import React, {Component} from 'react'
import injectSheet from 'react-jss'

const styles = {
    button: {
        backgroundColor: 'green',
        width: 110,
        height: 35,
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        textAlign: 'center'
    }
}

class Button extends Component {
    render(...args){
        return (
            <div className={this.props.classes.button} onClick={this.props.click}>
                <div>{this.props.text}</div>
            </div>
        )
    }
}

export default injectSheet(styles)(Button)
