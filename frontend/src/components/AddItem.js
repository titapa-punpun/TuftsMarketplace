// make the endpoint in the backend and decide what info you want from the frontend -- DONE
// test the endpoint using postman -- DONE
// make a route to the new page -- DONE
// make a link (from home page) to the new page (from the package called react router dom) -- DONE
// make empty form (itemName, description, price, quantity)
// do a handlechange, handlesubmit

import React from 'react';
import ReactDOM from 'react-dom';

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
        this.state = {item: item};

        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    /* defining handleChange function */
    handleChange(event) {
        // gets value that user types in
        this.setState({
            item: event.target.item
        });
    }

    /* defining handleSubmit function */
    handleSubmit(event) {
        this.setState({
            item: event.target.item
        });
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
                if (status !== 200){
                    this.setState({submitted: 'Username already exists. Please try again.'})
                    console.log('big bad')
                } else {
                    this.setState({submitted: 'Username successfully submitted!'})
                    console.log('success')
                }
            }).catch(x => {
            console.log('no data', x)
            return('no data')
        })
        event.preventDefault();
    }

    render() {
        console.log(this.state.item)
        return (
            <div>
                <form onSubmit = {this.handleSubmit}>
                    <label>
                        Item Name:
                        <input
                            type = "text"
                            name = {this.state.item.name}
                            onChange = {this.handleChange}
                        />
                    </label>
                    <label>
                        Item Description:
                        <input
                            type = "text"
                            description = {this.state.item.description}
                            onChange = {this.handleChange}
                        />
                    </label>
                    <label>
                        Item Price:
                        <input
                            type = "text"
                            price = {this.state.item.price}
                            onChange = {this.handleChange}
                        />
                    </label>
                    <label>
                        Quantity of Item:
                        <input
                            type = "text"
                            quantity = {this.state.item.quantity}
                            onChange = {this.handleChange}
                        />
                    </label>
                    <label>
                        Seller ID:
                        <input
                            type = "text"
                            quantity = {this.state.item.sellerID}
                            onChange = {this.handleChange}
                        />
                    </label>
                </form>
            </div>
        );
    }
}

export default AddItem;