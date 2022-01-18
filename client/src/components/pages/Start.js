import React from 'react';

import Choice from '../functional/Choice.js'
import InputForm from '../functional/InputForm.js'
import Loading from '../functional/Loading'
import Error from '../functional/Error'
import logo from './logo.png'
import ChooseGame from '../functional/ChooseGame.js'


import {Redirect} from 'react-router-dom'

import socketIOClient from 'socket.io-client'

//const ENDPOINT = 'http://localhost:4000/'
const ENDPOINT = 'http://multi-nonogram.herokuapp.com/'

class Start extends React.Component {
    constructor(props){
        super(props)
        this.state = {
            step: 1,
            name: '',
            newGame: null,
            room: '',
            loading: false,
            serverConfirmed: false,
            error: false,
            errorMessage: '',
            selectedGame:0,
        }
    }
    
    componentDidMount(){
        this.socket = socketIOClient(ENDPOINT, {transports: ['websocket']})
        this.socket.on('newGameCreated', (room) =>{
            this.setState({serverConfirmed:true, room:room})
        })
        this.socket.on('joinConfirmed', ()=>{
            this.setState({serverConfirmed:true})
        })
        this.socket.on('errorMessage', (message) => this.displayError(message))
    }


    componentWillUnmount(){
        this.socket.disconnect()
    }

    onChoice = (choice)=>{
        const gameChoice = choice==='new'?true:false
        let newState;
        // if(choice ==="new"){
        //     newState = {
        //         newGame: gameChoice,
        //         step: 3}

        // }else{
        newState = {
                    newGame: gameChoice,
                    step: 2};

        // }
        this.setState(newState);    
        
    }

    onChooseGame = (id)=>{
        const newState = {
            selectedGame: id,
        
        }
        this.setState(newState)
    }


    validate = ()=>{
        if (this.state.newGame){
            return !(this.state.name==='')
        }else{
            return !(this.state.name==='') && !(this.state.room==='')
        }
    }

    onSubmit = ()=>{
        // this.setState({loading: true})

        this.setState({loading: true})
        if (this.validate()){
            if (this.state.newGame){
                this.setState({step: 3})
            }else{
                console.log("joing this room ", this.state.room)
                this.socket.emit('joining', {room:this.state.room})
            }
        }else{
            setTimeout(()=>this.setState({loading: false }), 500)
            this.displayError(this.state.newGame? 'Please fill out your name':'Please fill out your name and room id')
        }
        // if (this.validate()){
        //     if (this.state.newGame){
        //         this.socket.emit('newGame')
        //     }else{
        //         this.socket.emit('joining', {room:this.state.room})
        //     }
        // }else{
        //     setTimeout(()=>this.setState({loading: false }), 500)
        //     this.displayError(this.state.newGame? 'Please fill out your name':'Please fill out your name and room id')
        // }


    }


    onSubmitSelectedGame = ()=>{
        //this should be only entered when the new game state is streu
        //this.socket.emit('newGame') //todo - render the slected gaem
        console.log("onsubmotSelectedGame");

        this.setState({loading: true})
        if (this.validate()){
            if (this.state.newGame){
                this.socket.emit('newGame', {puzzleId:this.state.selectedGame});
            }else{
                this.socket.emit('joining', {room:this.state.room, puzzleId:this.state.selectedGame})
            }
        }else{
            setTimeout(()=>this.setState({loading: false }), 500)
            this.displayError(this.state.newGame? 'Please fill out your name':'Please fill out your name and room id')
        }
        
        
    }

    stepBack = ()=>{
        this.setState({step: this.state.step - 1})
    }

    stepForward = () =>{
        this.setState({step: this.state.step + 1})
    }

    onTyping = (e)=>{
        const target = e.target.name
        const newState = {[target]:e.target.value}
        this.setState(newState)
    }

    displayError = (message) =>{
        this.setState({error:true, errorMessage:message, loading:false})
        setTimeout(()=>{
            this.setState({error:false, errorMessage:''})
        }, 3000)
    }

    render(){

        console.log(this.state)
        if (this.state.serverConfirmed){
            return(
                <Redirect to={`/game?room=${this.state.room}&name=${this.state.name}&gameid=${this.state.selectedGame}`} />
            )
        }else{
            switch(this.state.step){
                case(1):
                //seelct to either create a new gaem or join the game 
                    return (
                        <Choice logo={logo} onChoice={this.onChoice}/>
                    );
                case(2):
                    return (
                        <>
                            <Loading loading={this.state.loading}/>
                            <Error display={this.state.error} message={this.state.errorMessage}/>
                            <InputForm 
                                stepBack={this.stepBack} 
                                onSubmit={this.onSubmit} 
                                onTyping={this.onTyping.bind(this)}
                                newGame={this.state.newGame}
                                name = {this.state.name}
                                room = {this.state.room}/> 
                        </>
                    );
                case(3):
                    return (
                        <ChooseGame logo={logo} selectedGame={this.state.selectedGame} onChoice={this.onChooseGame} onSubmit={this.onSubmitSelectedGame}/>
                    );
                default:
                    console.log(this.state.step)
                    return (
                        <Choice logo={logo} onChoice={this.onChoice}/>
                    );
            }
        }
        
    }
    
}

export default Start;

