// make the endpoint in the backend and decide what info you want from the frontend
// test the endpoint using postman
// make a route to the new page
// make a link (from home page) to the new page (from the package called react router dom)
// make empty form
// do a handlechange, handlesubmit

import React from 'react';

class AddItem extends React.Component {
    constructor(props) {
        super(props);
        this.state = {value: ''};

        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    handleChange(event) {
        // gets value that user types in
        this.setState({value: event.target.value});
    }

    handleSubmit(event) {
        this.setState({value: ''});
        /* Here, call backend and give it the item information. */
        const body = {
            item: this.state.value,
        };
        fetch('http://127.0.0.1:5000/addItem',
            {method: 'POST',
                body: JSON.stringify(body),
                headers: {
                    'Content-Type': 'application/json'
                }})
        event.preventDefault();
    }

    render() {
        return (
            <div>
                <form onSubmit = {this.handleSubmit}>
                    <label>
                        Item:
                        <input type = "text" value = {this.state.value} onChange = {this.handleChange} />
                    </label>
                    <input type = "submit" value = "Submit" />
                </form>
                {this.state.submitted}
            </div>
        );
    }
}

export default AddItem;