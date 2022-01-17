import "./PuzzleSelect.css"
import React, { Component } from 'react';


class PuzzleSelect extends Component {
    // constructor(props){
    //   super(props)

    // }

    render(){

        return(
            <div className="puzzleSelect" onClick={this.props.onChoice.bind(this, this.props.choice)}>
                <div>width {this.props.width}</div>
                <div>height {this.props.height}</div>

            </div>


        )
    }

}

export default PuzzleSelect;