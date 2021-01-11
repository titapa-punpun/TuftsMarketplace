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
            .then(response => response.json())
            .then(response => {this.setState({items: response.allItems})})
    }

    render() {
        const items = this.state.items;
        console.log("items: ", items);
        return (
            <div>
                <h1>Items Available</h1>
                <div style={{display: 'flex', flexWrap: 'wrap'}}>
                    {items.map(item => (<div key={item.itemID}>
                                            Item: {item.itemName}
                                            <Link to={"/addBid/" + item.itemID + "/" + item.itemQuantity}>
                                                <button type={"button"}>Buy</button>
                                            </Link><br/>
                                            Description: {item.itemDescription}<br/>
                                            Price: ${item.itemPrice}<br/>
                                            Quantity: {item.itemQuantity}<br/> <br/>
                                        </div>))}
                </div>
            </div>
        );
    }
}

export default Home;