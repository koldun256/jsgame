import React, {Component} from 'react'

class Gameplay extends Component {
    constructor(props){
        super(props)
    }

    render(){
        return (
            <div>
                Gameplay
                {JSON.stringify(this.props.data)}
            </div>
        )
    }
}

export default Gameplay
