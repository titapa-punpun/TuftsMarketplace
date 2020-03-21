import React from 'react';


class Home extends React.Component {
    /* creating constructor */
    constructor(props) {
        super(props);
        /* Initializing 2 vars */
        this.state = {value: '', loggedIn: false};

        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    /* defining handleChange function */
    handleChange(event) {
        this.setState({value: event.target.value});
    }

    /* defining handleSubmit function */
    handleSubmit(event) {
        this.setState({value: ''});
        const body = {
            username: this.state.value,
        };
        fetch('http://127.0.0.1:5000/verifyUser',
            {method: 'POST',
                body: JSON.stringify(body),
                headers: {
                    'Content-Type': 'application/json'
                }})
            .then(response => response.status)
            .then(status => {
                if (status !== 200){
                    console.log('user doesnt exist')
                } else {
                    this.setState({loggedIn: true})
                    console.log('user exists')
                }
            }).catch(x => {
            console.log('no data', x)
            return('no data')
        })
        event.preventDefault();
    }

    render() {
        if (!(this.state.loggedIn))
            return (
                <div>
                    <form onSubmit = {this.handleSubmit}>
                        <label>
                            Login:
                            <input type = "text" value = {this.state.value} onChange = {this.handleChange} />
                        </label>
                        <input type = "submit" value = "Submit" />
                    </form>
                    Your username doesn't exist. Please create a new user.
                </div>
            );
        else
            return (
                <div>
                    You are now logged in!
                </div>
            )
    }
}

export default Home;