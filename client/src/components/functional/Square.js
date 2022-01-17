import React, {Component} from 'react';
import Icon from './icons'

class Square extends Component {

  constructor(props){
    super(props)}


  render(){

    console.log(this.props.value)

    if(this.props.class=="color"){
      if(this.props.squareColor == 0){
        return (
          <div className="square" style={{backgroundColor: 'white'}} onClick={this.props.onClick.bind(this, this.props.height, this.props.width)}>
  
          </div>
        );

      }else if(this.props.squareColor == 1){
        return (
          <div className="square" style={{backgroundColor: 'black'}} onClick={this.props.onClick.bind(this, this.props.height, this.props.width)}>
  
          </div>
        );

      }else if(this.props.squareColor == 2){
        return (
          <div className="square" style={{backgroundColor: 'blue'}} onClick={this.props.onClick.bind(this, this.props.height, this.props.width)}>
  
          </div>
        );

      }else{
        return (
          <div className="square" style={{backgroundColor: 'green'}} onClick={this.props.onClick.bind(this, this.props.height, this.props.width)}>
  
          </div>
        );

      }
  
    }else if(this.props.class=="constraint"){
      return (
      <div className="square" style={{backgroundColor: 'yellow'}} onClick={this.props.onClick.bind(this, this.props.height, this.props.width)}>
       {this.props.value}
      </div>);
  
    }else{
      return (
      <div className="square"  style={{backgroundColor: 'red'}}
      onClick={this.props.onClick.bind(this, this.props.height, this.props.width )}>
       
      </div>
    );
  
  }


}

  
  
}

export default Square;



