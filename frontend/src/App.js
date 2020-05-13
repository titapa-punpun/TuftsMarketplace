import React, { useState } from 'react';
import {
    BrowserRouter as Router,
    Switch,
    Route,
    Link,
    Redirect
} from "react-router-dom";
import CreateUser from './components/CreateUser'
import Login from './components/Login'
import Home from './components/Home'
import AddItem from './components/AddItem'
import AddBid from './components/AddBid'

export default function App() {
    const [loggedIn, setLoggedIn] = useState(false);
    const [userID, setUserID] = useState(0); // hook for global access to userID using setUserID function
    console.log(userID);
    return (
        <Router>
            <div>
                {/* A <Switch> looks through its children <Route>s and
                renders the first one that matches the current URL. */}
                <Switch>
                    <Route exact path="/createUser">
                        <CreateUser/>
                    </Route>
                    <Route exact path="/users">
                        <Users/>
                    </Route>
                    <Route exact path="/login">
                        <Login setLoggedIn={setLoggedIn} loggedIn={loggedIn} setUserID={setUserID}/>
                    </Route>
                    <Route exact path="/home">
                        {loggedIn ? <Home/> : <Redirect to="/login" />}
                    </Route>
                    <Route exact path="/addItem">
                        <AddItem/>
                    </Route>
                    <Route exact path="/addBid/:itemID/:quantAvail" render={(props) => <AddBid {...props} userID={userID}/>}>
                    </Route>
                    <Route exact path="/">
                        {loggedIn ? <Redirect to="/home" /> : <Redirect to="/login" />}
                    </Route>
                </Switch>
            </div>
        </Router>
    );
}

function About() {
    return <h2>About Me</h2>;
}

function Users() {
    return <h2>Users</h2>;
}