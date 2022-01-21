import React from 'react';

import Choice from '../functional/Choice.js'
import InputForm from '../functional/InputForm.js'
import Loading from '../functional/Loading'
import Error from '../functional/Error'
import logo from './logo.png'
import ChooseGame from '../functional/ChooseGame.js'
import Input from '../functional/Input.js';
import { Component } from 'react';
import ChoiceButton from "../functional/ChoiceButton"

import qs from 'qs'

import {Redirect} from 'react-router-dom'
import { useParams } from "react-router-dom";

import socketIOClient from 'socket.io-client'
//TODO - choises a game froma  alink 
//const ENDPOINT = 'http://localhost:4000/'
const ENDPOINT = 'http://multi-nonogram.herokuapp.com/'

class Invitation extends React.Component {
    constructor(props){
        super(props)
        this.state = {
            step: 1,
            selectedGame:0,
            gameid:0,
            newGame: null,
            room: '',
            loading: false,
            serverConfirmed: false,
            error: false,
            errorMessage: '',
            selectedGame:0,
            name:""
        }
    }
    
    componentDidMount(){
        this.socket = socketIOClient(ENDPOINT, {transports: ['websocket']})

        
        // const {room, gameid} = qs.parse(window.location.search, {
        //     ignoreQueryPrefix: true
        // })

        


  // get the username from route params
        //const { room, gameid } = useParams();

        let newState={
            room:this.props.match.params.room,
            selectedGame: this.props.match.params.gameid,
            gameid:this.props.match.params.gameid
        
        }

        this.setState(newState)
            


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

            console.log("joing this room ", this.state.room)
            this.socket.emit('joining', {room:this.state.room})
            
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

                    return (
                        <>
                            <Loading loading={this.state.loading}/>
                            <Error display={this.state.error} message={this.state.errorMessage}/>
                            <div>{this.state.selectedGame}</div>

                            <div className="input-container">
                                <Input 
                                name='name'
                                placeholder='Your Name...'
                                onChange = {this.onTyping}
                                value = {this.state.name}
                                />

                                <div className='nav-container'>
                                    <ChoiceButton type='nav-back' choice='back' onChoice={this.stepBack} label='Back'/>
                                    <ChoiceButton type='nav-forward' choice='submit' onChoice={this.onSubmit} label="Let's Go"/>
                                    
                                </div>
                            </div>
            
                        </>
                    );
                
            }
        }
        
    }
    


export default Invitation;

