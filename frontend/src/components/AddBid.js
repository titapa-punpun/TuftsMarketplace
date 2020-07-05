// make the endpoint in the backend and decide what info you want from the frontend
// test the endpoint using postman
// make a route to the new page -- DONE
// make a link (from home page) to the new page (from the package called react router dom) -- DONE
// make empty form (bid price, quantity) -- DONE
// write handlechange -- DONE
// write handlesubmit

import React from 'react';

class AddBid extends React.Component {
    constructor(props) {
        super(props);
        /* Initializing object properties */
        var bidInfo = {
            bidPrice: '',
            quantity: '',
        };
        this.state = {
            bidInfo: bidInfo,
            submitted: false,
            itemID: props.match.params.itemID,
            quantAvail: props.match.params.quantAvail
        };
        console.log('quant available: ', this.state.quantAvail);

        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    /* defining handleChange function */
    handleChange(event, field) {
        const {bidInfo} = this.state // extracting bidInfo from state
        bidInfo[field] = event.target.value
        this.setState({
            bidInfo: bidInfo
        })
    }

    /* defining handleSubmit function */
    handleSubmit(event) {
        const date = new Date();
        /* Here, call backend and give it item info. */
        const body = {
            date: date.toDateString(),
            bidInfo: this.state.bidInfo,
            itemID: this.state.itemID,
            bidderID: this.props.userID,
        };
        fetch('http://127.0.0.1:5000/addBid',
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
        event.preventDefault();
    }

    // checks that all fields have been filled
    handleValidation(event, field) {
        console.log('in handleValidation')
        let bidInfo = this.state.bidInfo;
        let bidQuant = parseInt(bidInfo.quantity);
        let quantAvail = parseInt(this.state.quantAvail);
        let formIsValid = true;

        if (!bidInfo[field]) {
            formIsValid = false;
            this.setState({submitted: 'Field(s) cannot be left blank.'})
            console.log('Form empty')
        } else if (bidQuant <= 0 || bidQuant > quantAvail) {
            formIsValid = false;
            console.log('Quant submitted is invalid.');
            this.setState({submitted: 'The quantity you submitted is invalid. Please try again.', bidInfo: {bidPrice: '', quantity: ''}})
        }
        event.preventDefault();
        return formIsValid;
    }

    render() {
        const {bidInfo} = this.state
        console.log('in props: ', this.props)
        console.log('bid info: ', bidInfo)
        return (
            <div>
                <h1>Enter Bidding Information</h1>
                <form onSubmit={(event) => {
                    if (this.handleValidation(event, 'bidPrice') && this.handleValidation(event, 'quantity')) {
                        this.handleSubmit(event);
                        // this.props.history.goBack();
                    }}}>
                    <label>
                        Bid Price (per 1 count):
                        <input
                            type="text"
                            value={bidInfo.bidPrice}
                            onChange={(event) => this.handleChange(event, 'bidPrice')}
                        /><br/>
                    </label>
                    <label>
                        Quantity:
                        <input
                            type="text"
                            value={bidInfo.quantity}
                            onChange={(event) => this.handleChange(event, 'quantity')}
                        />
                    </label><br/>
                    <input type="submit" value="Submit" />
                </form>
                {this.state.submitted}
            </div>
        );
    }
}

export default AddBid;