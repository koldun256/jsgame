import React from "react";
import ReactDOM from "react-dom";
import io from 'socket.io-client'
import config from './config.json'
import Main from './Components/Main'
const socket = io(config['socket-path'])

ReactDOM.render(<Main />, document.getElementById("root"));
