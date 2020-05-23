import React from 'react';

class MyAccount extends React.Component {
    constructor(props) {
        super(props);
        this.state = {notifications: []}
    }


    componentDidMount() {
        const body = {
            userID: this.props.userID,
        };
        fetch('http://127.0.0.1:5000/getBidOffers',
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
                {notifications.length === 0 ? <div>You currently have no notifications.</div>:
                    notifications.map(noti => (<div key={noti.notiID}> Notification Type: {noti.notiType} <br/>
                    Message: {noti.notiMessage} <br/>
                    Status: {noti.notiStatus} <br/> <br/> </div>))}

            </div>
        );
    }
}

export default MyAccount;