import React from 'react';
import './css/bee.css';

export default class Bee extends React.Component {
    render(){
        return(
            <div
                id="bee" className="idle"
                onMouseDown= { this.props.onBeeMouseDown }
            />
        )
    }
}