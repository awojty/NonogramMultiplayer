import "./PuzzleSelect.css"
import React, { Component } from 'react';


class PuzzleSelect extends Component {
    // constructor(props){
    //   super(props)

    // }

    render(){

        console.log(this.props)

        if(this.props.selectedGame === this.props.choice){
            return(
                <div className="puzzleSelect" style={{backgroundColor: 'yellow'}} onClick={this.props.onChoice.bind(this, this.props.choice)}>
                    <div>width: {this.props.width}</div>
                    <div>height: {this.props.height}</div>
    
                </div>
    
    
            )


        }else{

            return(
                <div className="puzzleSelect" style={{backgroundColor: 'white'}} onClick={this.props.onChoice.bind(this, this.props.choice)}>
                    <div>width: {this.props.width}</div>
                    <div>height: {this.props.height}</div>
    
                </div>
    
    
            )

        }

        

       
    }

}

export default PuzzleSelect;