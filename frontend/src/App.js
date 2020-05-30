import React, { useState } from 'react';
import {
    BrowserRouter as Router,
    Switch,
    Route,
    Link,
    Redirect
} from "react-router-dom";
import Header from './components/Header'
import CreateUser from './components/CreateUser'
import Login from './components/Login'
import Home from './components/Home'
import AddItem from './components/AddItem'
import AddBid from './components/AddBid'
import MyListings from './components/MyListings'


export default function App() {
    const [loggedIn, setLoggedIn] = useState(false);
    const [userID, setUserID] = useState(0); // hook for global access to userID using setUserID function
    console.log('user id: ', userID);
    console.log('loggedin: ', loggedIn);
    return (
        <Router>
            <div style={{width: '100vw'}}>
                {/* A <Switch> looks through its children <Route>s and
                renders the first one that matches the current URL. */}
                <Route path={['/home', '/addItem', '/addBid','/myAccount']} render={(props) => <Header {...props} setLoggedIn={setLoggedIn} loggedIn={loggedIn}/>}/>
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
                    <Route exact path="/addItem" render={(props) => <AddItem {...props}/>}>
                    </Route>
                    <Route exact path="/addBid/:itemID/:quantAvail" render={(props) => <AddBid {...props} userID={userID}/>}>
                    </Route>
                    <Route exact path="/myAccount">
                        <MyListings/>
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