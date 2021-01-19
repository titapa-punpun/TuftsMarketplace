import React from 'react';
import './Header.css';
import {Link, Redirect} from 'react-router-dom';
import AppBar from '@material-ui/core/AppBar';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import HomeRoundedIcon from '@material-ui/icons/HomeRounded';
import AddRoundedIcon from '@material-ui/icons/AddRounded';
import AccountBoxRoundedIcon from '@material-ui/icons/AccountBoxRounded';
import ExitToAppRoundedIcon from '@material-ui/icons/ExitToAppRounded';

const tabStyle = {color: 'grey', fontSize: 10, outline: 'none', textDecoration: 'none', minWidth: 20};

const tabs = ['/home', '/addItem', '/adddBid','/myAccount'];

export default function Header(props) {
    const [value, setValue] = React.useState(1);
    const {setLoggedIn} = props;
    if (!(props.loggedIn)) {
        return (
            <Redirect to={'/login'}/>
        );
    }

    console.log('props: ', props);

    const handleChange = (event, newValue) => {
        setValue(newValue);
    };

    return (
        <div>

            <AppBar position="static" color="default">
                <Tabs
                    value={value}
                    onChange={handleChange}
                    variant="fullWidth"
                    scrollButtons="on"
                    indicatorColor="primary"
                    textColor="primary"
                    aria-label="scrollable force tabs example"
                >
                    <div>
                        <div id='toptitle'>
                            Tufts Marketplace <br/>
                        </div>
                        <div id="topsubtitle">A marketplace for Tufts students</div>
                    </div>
                    <Tab label="Home" icon={<HomeRoundedIcon />} to='/home' component={Link} style={tabStyle}/>
                    <Tab label="Add Item" icon={<AddRoundedIcon/>} to='/addItem' component={Link} style={tabStyle} />
                    <Tab label="My Account" icon={<AccountBoxRoundedIcon/>} to='/myAccount' component={Link} style={tabStyle} />
                    <Tab label="Logout" icon={<ExitToAppRoundedIcon/>} to='/myAccount' component={Link} style={tabStyle} />
                </Tabs>
            </AppBar>
        </div>
    )

}

