import React, { Component } from 'react'

import PuzzleSelect from "./PuzzleSelect.js"
import jsonData from "./puzzles.json"
//const jsonData1= require('json!./puzzles.json');
console.log(typeof(jsonData))

// const jsonData = JSON.parse(jsonData1)["puzzles"]
// console.log(jsonData)


// console.log(jsonData1)
console.log(jsonData['puzzles'])

class ChooseGame extends Component {
    constructor(props){
      super(props)
      this.state={
          data : jsonData['puzzles'],
      }

    }


    render(){

        return(
            <>
            <div>
                {this.state.data.map(element =>  
                <PuzzleSelect
                    key = {element.id}
                    
                    choice ={element.id}
                    onChoice={this.props.onChoice}
                    columns = {element.columns} 
                    rows = {element.rows} 
                    width={element.width} 
                    height={element.height}
                    
                    >

                    </PuzzleSelect>)}
                </div>
                <div onClick={this.props.onSubmit}>Submit</div>
            </>


        )
    }
    
    
}

export default ChooseGame;