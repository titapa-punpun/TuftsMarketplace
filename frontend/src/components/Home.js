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

    // render() {
    //     const l = [1, 2, 3, 4]
    //         return (
    //             <div>
    //                 {l.map(x => (<div key={x}>{x}<br/></div>))}
    //             </div>
    //         );
    // }

    render() {
        const allItems = this.state.items;
        return (
            <div style={{display: 'flex', flexWrap: 'wrap'}}>
                {allItems.map(item => (<div key={item.itemID}> Item: {item.itemName} <br/>
                                       Description: {item.itemDescription} <br/>
                                       Price: ${item.itemPrice} <br/>
                                       Quantity: {item.itemQuantity} <br/> </div>))}
                <br/>
                <p>If you want to add item(s) to sell:</p>
                <ul>
                    <Link to="/addItem">Add Items</Link>
                </ul>
            </div>
        );
    }
}

export default Home;