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
            .then(response => response.status)
            .then(status => {
                if (status != 200){
                    this.setState({submitted: 'Bid submission failed.'})
                    console.log('big bad')
                } else {
                    this.setState({submitted: 'Bid successfully submitted!', bidInfo: {bidPrice: '', quantity: ''}})
                    console.log('success')
                }
            }).catch(x => {
            console.log('no data', x)
            return('no data')
        })
    }

    render() {
        const {notifications} = this.state;
        const {setUserID} = this.props;
        console.log('user id: ', setUserID);
        return (
            <div style={{display: 'flex', flexWrap: 'wrap'}}>

            </div>
        );
    }
}

export default MyAccount;