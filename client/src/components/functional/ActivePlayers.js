import React from 'react'
import { Component } from 'react'


class ActivePlayers extends Component {
    constructor(props){
        super(props)
    }    


    render(){
        return (
            <div className='score-board'>
                 <h1 className="score-title">Active Players</h1>
                {this.props.players.map(element=>
                <div>{element}</div>
    
    
    
    
                )}
               
               
            </div>
        )


    }
    
}

export default ActivePlayers
