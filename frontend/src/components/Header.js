import React from 'react';
import {Redirect} from 'react-router-dom';

const tabStyle = {color: 'grey', fontSize: 10, outline: 'none', textDecoration: 'none', minWidth: 20};

const tabs = ['/home', '/addItem', '/addBid', '/myAccount'];

export default function Header(props) {
    const {setLoggedIn} = this.props;
    if (!(this.props.loggedIn)) {
        return (
            <Redirect to={'/login'}/>
        );
    }
}

