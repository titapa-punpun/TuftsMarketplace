import React from 'react';
import { Link } from 'react-router-dom'

class Home extends React.Component {
    /* creating constructor */
    constructor(props) {
        super(props);
        this.state = {items: []}
    }

    componentDidMount() {
        fetch('http://127.0.0.1:5000/getAllItems',
            {method: 'GET'})
            // => separates parameter from body of lambda function. LHS is param, RHS is the body of func.
            .then(response => response.json())
            .then(response => {this.setState({items: response.allItems})})
    }

    // logout() {
    //     if (this.state.setLoggedIn == false)
    //         return <Redirect to='/login'/>
    // }

    render() {
        const items = this.state.items;
        // const {setLoggedIn} = this.props;
        // console.log('setLoggedIn: ', setLoggedIn);
        return (
            <div>
                <div style={{display: 'flex', flexWrap: 'wrap'}}>
                    {items.map(item => (<div key={item.itemID}> Item: {item.itemName}
                                        <Link to={"/addBid/" + item.itemID + "/" + item.itemQuantity}><button type={"button"}>Buy</button></Link> <br/>
                                        Description: {item.itemDescription} <br/>
                                        Price: ${item.itemPrice} <br/>
                                        Quantity: {item.itemQuantity} <br/> <br/> </div>))}
                </div>
            </div>
        );
    }
}

export default Home;