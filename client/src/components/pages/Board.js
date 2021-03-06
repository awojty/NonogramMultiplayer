import React, { Component } from 'react'
import {Redirect} from 'react-router-dom'

import Square from '../functional/Square'
import Wait from '../functional/Wait'
import Status from '../functional/Status'
import ScoreBoard from '../functional/ActivePlayers'
import PlayAgain from '../functional/PlayAgain'
import jsonData from "../functional/puzzles.json"
import uuid from 'react-uuid'
import ActivePlayers from "../functional/ActivePlayers"

import io from 'socket.io-client'
import qs from 'qs'

const ENDPOINT = 'http://multi-nonogram.herokuapp.com/'
//const ENDPOINT = 'http://localhost:4000/'

//TODO - oplaed frmo json or db 
const HEIGHT = 10
const WIDTH = 10



class Board extends Component {
  constructor(props){
    super(props)

    const gameBoard  = new Array(HEIGHT);
    

    for (var i = 0; i < gameBoard.length; i++) {
        gameBoard[i] = new Array(WIDTH).fill(0);
        
    }

    console.log("gameboard", gameBoard);
    this.state = {
      width:WIDTH,
      height:HEIGHT,
      game: gameBoard,
      piece: 'X',
      turn: true,
      end: false,
      room: '',
      statusMessage: '',
      currentPlayerScore: 0,
      opponentPlayer: [],
      activePlayers:[],
      //State to check when a new user join
      waiting: false,
      joinError: false,
      gameid:0,
      rows:[[],[],[],[],[],[],[],[],[],[]],
      columns:[[],[],[],[],[],[],[],[],[],[]],
      started:false
    }
    this.socketID = null
  }

  componentDidMount() {
    //Getting the room and the username information from the url
    //Then emit to back end to process
    this.socket = io(ENDPOINT,  {transports: ['websocket']})


    //this.socket = io(ENDPOINT)


    const {room, name, gameid} = qs.parse(window.location.search, {
      ignoreQueryPrefix: true
     })

    console.log("gameid", gameid);
    
    let newState={
      room:room,
      name:name.abbrev,
      columns:jsonData['puzzles'][gameid]["columns"],
      rows:jsonData['puzzles'][gameid]["rows"]
    }
    this.setState(newState)

    console.log("newstate", newState)

    //TODO: get eh current number of players from the room and if gfreater than 1, then dont renew the game - sockets with promises?

    if(!this.state.started){
      this.socket.emit('newRoomJoin', {room, name, WIDTH, HEIGHT})
      this.setState({started:true})
    
    }
    

    //New user join, logic decide on backend whether to display 
    //the actual game or the wait screen or redirect back to the main page
    this.socket.on('waiting', ()=> this.setState({waiting:true, currentPlayerScore:0, opponentPlayer:[]}))
    this.socket.on('starting', ({gameState})=> {
      this.setState({waiting:false})
      this.gameStart(gameState)
    })
    this.socket.on('joinError', () => this.setState({joinError: true}))

    //Listening to the assignment of piece store the piece along with the in state
    //socket id in local socketID variable
    this.socket.on('pieceAssignment', ({piece, id}) => {
      this.setState({piece: piece})
      this.socketID = id 
    })

    //Game play logic events
    this.socket.on('update', ({gameState, activePlayers}) => this.handleUpdate(gameState, activePlayers))
    this.socket.on('winner', ({gameState,id}) => this.handleWin(id, gameState))
    this.socket.on('draw', ({gameState}) => this.handleDraw(gameState))

    this.socket.on('restart', ({gameState}) => this.handleRestart(gameState))
  }

  //Setting the states to start a game when new user join
  gameStart(gameState, players){
    //const opponent = players.filter(([id, name]) => id!==this.socketID)[0][1]
    this.setState({end:false})
    this.setBoard(gameState)
    
    this.setMessage()
  }

  //When some one make a move, emit the event to the back end for handling
  handleClick = (height,width) => {
    console.log("handleclick");
    
    const {game, piece, end, turn, room} = this.state
    // if (!game[index] && !end && turn){
    //   this.socket.emit('move', {room, piece, height,width })
    // }

    this.socket.emit('move', {room,  height,width })
  }

  //Setting the states each move when the game haven't ended (no wins or draw)
  handleUpdate(gameState, activePlayers){

    //render new board based on the one returned by the server
    this.setBoard(gameState)
    this.setState({activePlayers:activePlayers})
    
    this.setMessage()
  }

  //Setting the states when some one wins
  handleWin(id, gameState) {
    this.setBoard(gameState)
    if (this.socketID === id){
      const playerScore = this.state.currentPlayerScore + 1
      this.setState({currentPlayerScore:playerScore, statusMessage:'You Win'})
    }else{
      const opponentScore = this.state.opponentPlayer[1] + 1
      const opponent = this.state.opponentPlayer
      opponent[1] = opponentScore
      this.setState({opponentPlayer:opponent, statusMessage:`${this.state.opponentPlayer[0]} Wins`})
    }
   
    this.setState({end:true})
  }

  //Setting the states when there is a draw at the end
  handleDraw(gameState){
    this.setBoard(gameState)
    this.setState({end:true, statusMessage:'Draw'})
  }

  playAgainRequest = () => {
    this.socket.emit('playAgainRequest', this.state.room)
  }

  //Handle the restart event from the back end
  handleRestart(gameState, turn){
    this.setBoard(gameState)
    
    this.setMessage()
    this.setState({end: false})
  }

  //Some utilities methods to set the states of the board

  setMessage(){
    const message = this.state.turn?'Your Turn':`${this.state.opponentPlayer[0]}'s Turn`
    this.setState({statusMessage:message})
  }



  setBoard(gameState){
    this.setState({game:gameState})
  }
  
  renderSquare(i,j){
    console.log("i,j", i,j)
    return(
      <Square 
      key={uuid()} 
      class ={"color"}
      squareColor = {this.state.game[i][j]}
      value={this.state.game[i][j]} 
      player={this.state.piece} 
      end={this.state.end} 
      id={i} 
      onClick={() => this.handleClick(i,j)}
                              /> 
    )
  }

  renderEmptySquare(i,j){
    return(
      <Square 
        squareColor = {0}
        class ={"empty"}
        key={uuid()} 
        value={0} 
        player={this.state.piece} 
        end={this.state.end} 
        id={i+j} 
        onClick={() => this.handleClick(i,j)}
        turn={this.state.turn}
      /> 
    )
  }

  renderConstraintSquare(i,j, constraint){
    console.log("returncosn");
    return(
      <Square 
      squareColor = {0}
      class ={"constraint"}
      key={uuid()} 
      value={constraint} 
      player={this.state.piece} 
      end={this.state.end} 
                              id={i+j} 
                              onClick={() => this.handleClick(i,j)}
                              turn={this.state.turn}/> 
    )
  }

  returnGridDimensions(){

    const squareArray = []
    let maxColLen = 0;
    let maxRowLen = 0;

    for(let i = 0; i< WIDTH; i++){
        let counter = 0;

        let col = this.state.columns[i];
        for(let j = 0; j< col.length; j++){
          if(col[j]!= null){
            counter++;

          }
        }
        if( counter > maxColLen){
              maxColLen = counter;
          }
      }

    for(let i = 0; i< HEIGHT; i++){
        let counter = 0;
        let row = this.state.rows[i];

        for(let j = 0; j< row.length; j++){
          if(row[j]!= null){
            counter++;

          }
        }

        if( counter > maxRowLen){
          maxRowLen = counter;
      }

    }
    const totalHeight = maxColLen + HEIGHT;
    const totalWidth = maxRowLen + WIDTH;

    return [totalHeight, totalWidth];


  }


  returnMaxConstraintDimensions(){

    const squareArray = []
    let maxColLen = 0;
    let maxRowLen = 0;

    for(let i = 0; i< WIDTH; i++){
        let counter = 0;

        let col = this.state.columns[i];
        for(let j = 0; j< col.length; j++){
          if(col[j]!= null){
            counter++;

          }
        }
        if( counter > maxColLen){
              maxColLen = counter;
          }
      }

    for(let i = 0; i< HEIGHT; i++){
        let counter = 0;
        let row = this.state.rows[i];

        for(let j = 0; j< row.length; j++){
          if(row[j]!= null){
            counter++;

          }
        }

        if( counter > maxRowLen){
          maxRowLen = counter;
      }

    }
    const totalHeight = maxColLen;
    const totalWidth = maxRowLen ;

    return [totalHeight, totalWidth];


  }



  prepareDisplayGrid(){
    const squareArray = []

    let dims1 = this.returnMaxConstraintDimensions();
    let maxColLen = dims1[0];
    let maxRowLen = dims1[1];

    let dims = this.returnGridDimensions();
    const totalHeight =dims[0];
    const totalWidth = dims[1];

    console.log(totalHeight);
    console.log(totalWidth)

    for(let i = 0; i< totalHeight; i++){
        for(let j = 0; j< totalWidth; j++){
            if( j<maxRowLen && i<maxColLen){
              //white sqaure in the op left part 
                const newSquare = this.renderEmptySquare(i,j)
                squareArray.push(newSquare)

            }else if(j>=maxRowLen && i>=maxColLen){
              //game field
                const newSquare = this.renderSquare(i-maxColLen,j-maxRowLen)
                squareArray.push(newSquare)


            }else if(j>=maxRowLen && i<maxColLen){
              //top cosntraints

                const constraint = this.state.columns[j-maxRowLen].slice(-maxColLen );
                if(constraint[i] == null){
                    const newSquare = this.renderEmptySquare(i,j)
                    squareArray.push(newSquare)

                }else{
                    const newSquare = this.renderConstraintSquare(i,j, constraint[i])
                    squareArray.push(newSquare)

                }
                

            }else if(j<maxRowLen && i>=maxColLen){

                const constraint = this.state.rows[i-maxColLen].slice(-maxRowLen );
                if(constraint[j] == null){
                    const newSquare = this.renderEmptySquare(i,j)
                    squareArray.push(newSquare)

                }else{
                    const newSquare = this.renderConstraintSquare(i,j, constraint[j])
                    squareArray.push(newSquare)

                }

            }else{

                    const newSquare = this.renderEmptySquare(i,j)
                    squareArray.push(newSquare)




            }


        }
    }

    return squareArray;

  }

  

  render(){
    console.log(this.state)
    


    if (this.state.joinError){
      return(
        <Redirect to={`/`} />
      )
    }else{
      const squareArray = this.prepareDisplayGrid();
      const numberArray = this.returnGridDimensions();
      const totalHeight = numberArray[0];
      const totalWidth = numberArray[1];
      //const totalHeight, totalWidth = this.returnGridDimensions();
      console.log(totalHeight);
      console.log(totalWidth)
      let dropzoneStyle = {
        display: `grid`,
        width: `max-content`,
        height: `max-content`,
        gridTemplateColumns: `repeat(${totalWidth}, auto)`,
        gridTemplateRows: `repeat(${totalHeight}, auto)`,
        
      };

      const link = "http://multi-nonogram.herokuapp.com/invitation/"+this.state.room+"/"+this.state.gameid;
      console.log("link", link);
      return(
        <>
          {/* <Wait display={this.state.waiting} room={this.state.room}/> */}
          {/* <Status message={this.state.statusMessage}/> */}
          <div style={dropzoneStyle}>
            {squareArray}
          </div>
          <div>Copy this link to invite a friend</div>
          <div>{link}</div>
          <ActivePlayers players={this.state.activePlayers}/>
          <PlayAgain end={this.state.end} onClick={this.playAgainRequest}/>
        </>
      )
    }
  }
}


export default Board



