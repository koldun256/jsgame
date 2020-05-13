import React from "react";
import ReactDOM from "react-dom";
import io from 'socket.io-client'
import config from './config.json'
const socket = io(config['socket-path'])
const Index = () => {
  return <div>Hello React!</div>
}
console.log('run js')
ReactDOM.render(<Index />, document.getElementById("root"));
