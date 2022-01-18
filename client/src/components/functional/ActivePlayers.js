import React from 'react'
import { Component } from 'react'
import uuid from 'react-uuid'

class ActivePlayers extends Component {
    constructor(props){
        super(props)
    }    


    render(){
        return (
            <div className='score-board'>
                 <h1 className="score-title">Active Players</h1>
                {this.props.players.map(element=>
                <div key={uuid()}>{element.name}</div>
    
    
    
    
                )}
               
               
            </div>
        )


    }
    
}

export default ActivePlayers
