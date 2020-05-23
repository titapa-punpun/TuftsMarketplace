// make the endpoint in the backend and decide what info you want from the frontend
// test the endpoint using postman
// make a route to the new page -- DONE
// make a link (from home page) to the new page (from the package called react router dom)
// make empty form (itemName, description, price, quantity)
// write handlechange
// write handlesubmit

import React from 'react';

class AddItem extends React.Component {
    constructor(props) {
        super(props);
        /* Initializing object properties */
        var item = {
            name: '',
            description: '',
            price: '',
            quantity: '',
            sellerID: '',
        };
        this.state = {item: item, submitted: false};

        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    /* defining handleChange function */
    handleChange(event, field) {
        const {item} = this.state // extracting item from state
        item[field] = event.target.value
        // gets value that user types in
        this.setState({
            item: item
        })
    }

    /* defining handleSubmit function */
    handleSubmit(event) {
        /* Here, call backend and give it item info. */
        const body = {
            item: this.state.item,
        };
        fetch('http://127.0.0.1:5000/addItem',
            {method: 'POST',
                body: JSON.stringify(body),
                headers: {
                    'Content-Type': 'application/json'
                }})
            .then(response => response.status)
            .then(status => {
                if (status != 200){
                    this.setState({submitted: 'Item submission failed.'})
                    console.log('big bad')
                } else {
                    this.setState({
                        submitted: 'Item successfully submitted!',
                        item: {name: '', description: '', price: '', quantity: '', sellerID: ''}
                    })
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
        let item = this.state.item;
        let formIsValid = true;

        if (!item[field]) {
            formIsValid = false;
            this.setState({submitted: 'Field(s) cannot be left blank.'})
            console.log('Form empty')
        }
        event.preventDefault();
        return formIsValid;
    }

    render() {
        const {item} = this.state
        return (
            <div>
                <h1>Enter Product Information</h1>
                <form onSubmit = {(event) => {
                    if (this.handleValidation(event, 'name') && this.handleValidation(event, 'description')
                        && this.handleValidation(event, 'price') && this.handleValidation(event, 'quantity')
                        && this.handleValidation(event, 'sellerID')) {
                        this.handleSubmit(event);
                        // this.props.history.goBack();
                    }}}>
                    <label>
                        Item Name:
                        <input
                            type = "text"
                            name = {item.name}
                            onChange = {(event) => this.handleChange(event, 'name')}
                        /><br/>
                    </label>
                    <label>
                        Item Description:
                        <input
                            type = "text"
                            description = {this.state.item.description}
                            onChange = {(event) => this.handleChange(event, 'description')}
                        /><br/>
                    </label>
                    <label>
                        Item Price:
                        <input
                            type = "text"
                            price = {this.state.item.price}
                            onChange = {(event) => this.handleChange(event, 'price')}
                        /><br/>
                    </label>
                    <label>
                        Quantity of Item:
                        <input
                            type = "text"
                            quantity = {this.state.item.quantity}
                            onChange = {(event) => this.handleChange(event, 'quantity')}
                        /><br/>
                    </label>
                    <label>
                        Seller ID:
                        <input
                            type = "text"
                            quantity = {this.state.item.sellerID}
                            onChange = {(event) => this.handleChange(event, 'sellerID')}
                        /><br/>
                    </label>
                    <input type="submit" value = "Submit" />
                </form>
                {this.state.submitted}
            </div>
        );
    }
}

export default AddItem;