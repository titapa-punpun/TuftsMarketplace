import React from 'react';


class CreateUser extends React.Component {
    /* creating constructor */
    constructor(props) {
        super(props);
        /* Initializing 2 vars */
        this.state = {value: '', submitted: false};

        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    /* defining handleChange function */
    handleChange(event) {
        this.setState({value: event.target.value});
    }

    /* defining handleSubmit function */
    handleSubmit(event) {
        this.setState({value: '', submitted: true});
        /* Here, call backend and give it the username. */
        event.preventDefault();
    }

    render() {
        return (
            <div>
                <form onSubmit = {this.handleSubmit}>
                    <label>
                        Username:
                        <input type = "text" value = {this.state.value} onChange = {this.handleChange} />
                    </label>
                        <input type = "submit" value = "Submit" />
                </form>
                {this.state.submitted ? 'Successfully submitted username!' : ''}
            </div>
        );
    }
}

export default CreateUser;