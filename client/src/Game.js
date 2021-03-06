import React from 'react';
import {BrowserRouter as Router, Route} from 'react-router-dom'

import Start from './components/pages/Start';
import Board from './components/pages/Board'
import Invitation from './components/pages/Invitation';

const Game = () => (
    <Router>
        <Route path='/' exact component={Start} />
        <Route path='/game' component={Board} />
        <Route path='/invitation/:room/:gameid' component={Invitation} />
        {/* <Invitation path='/invitation/:room/:gameid'/> */}
        

    </Router>
)
 
export default Game