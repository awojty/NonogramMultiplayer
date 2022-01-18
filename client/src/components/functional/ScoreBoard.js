import React from 'react'
import Score from './Score'

export default function ScoreBoard({data}) {
    return (
        <div className='score-board'>
             <h1 className="score-title">Active Players</h1>
            {this.props.players.map(element=>
            <div>{element}</div>




            )}
           
           
        </div>
    )
}
