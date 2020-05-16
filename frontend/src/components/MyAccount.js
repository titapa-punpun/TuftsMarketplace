import React from 'react';
import { Link } from 'react-router-dom'

class MyAccount extends React.Component {
    constructor(props) {
        super(props);
        this.state = {notifications: []}
    }


    componentDidMount() {
        const body = {
            userID: this.props.userID,
        };
        fetch('http://127.0.0.1:5000/getNotifications',
            {method: 'POST',
                body: JSON.stringify(body),
                headers: {
                    'Content-Type': 'application/json'
                }})
            .then(response => response.json())
            .then(response => {this.setState({notifications: response.allNotifications})})
    }

    render() {
        const notifications = this.state.notifications;
        console.log('noti: ', notifications);
        const {setUserID} = this.props;
        console.log('user id: ', setUserID);
        return (
            <div>
                <h1>Your Notifications</h1>
                <div style={{display: 'flex', flexWrap: 'wrap'}}>
                     {notifications.map(noti => (<div key={noti.notiID}> Notification Type: {noti.notiType} <br/>
                                                Message: {noti.notiMessage} <br/>
                                                Status: {noti.notiStatus} <br/> <br/> </div>))}
                </div>
            </div>
        );
    }
}

export default MyAccount;