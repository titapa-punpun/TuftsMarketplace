import React from 'react';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';
import ListingRow from './ListingRow'
import {TableCellWrapper} from './Helpers'

class MyListings extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            itemsAndBids: [],
        };
        this.updateMyListings = this.updateMyListings.bind(this);
    }

    componentDidMount() {
        const {userID} = this.props;
        const body = {
            userID: userID,
        };
        fetch('http://127.0.0.1:5000/getMyItems',
            {
                method: 'POST',
                body: JSON.stringify(body), // body is originally a JS object, but this body needs to receive a JSON string
                headers: {
                    'Content-Type': 'application/json' // tells receiver (endpoint) what type 'body' is
                }
            })
            .then(response => {
                // console.log("response: ", response);
                if (response.status !== 200) {
                    console.log('status was not 200, was ', response.status)
                } else {
                    return response;
                }
            }).then(response => response.json())
            .then(json => {
                this.setState({
                    itemsAndBids: json['allMyItems'],
                    // notifications: json['notifications'],
                })
            }).catch(x => {
            console.log('no data', x);
            return('no data')
        })
    }

    // Gets called by child component when appropriate (when archive happens and listings need to be refreshed)
    updateMyListings() {
        console.log("in updateMyListings()");
        const {userID} = this.props;
        const body = {
            userID: userID,
        };
        fetch('http://127.0.0.1:5000/updateMyListings',
            {
                method: 'POST',
                body: JSON.stringify(body), // body is originally a JS object, but this body needs to receive a JSON string
                headers: {
                    'Content-Type': 'application/json' // tells receiver (endpoint) what type 'body' is
                }
            })
            .then(response => {
                // console.log("response: ", response);
                if (response.status !== 200) {
                    console.log('status was not 200, was ', response.status)
                } else {
                    return response;
                }
            }).then(response => response.json())
            .then(json => {
                this.setState({
                    itemsAndBids: json['myUpdatedListings'],
                })
            }).catch(x => {
            console.log('no data', x);
            return('no data')
        })
    }

    render() {
        const {itemsAndBids} = this.state;
        // console.log('items and bids: ', itemsAndBids);
        return (
            <div>
                <h2>My Listings</h2>
                <TableContainer component={Paper}>
                    <Table aria-label="collapsible table">
                        <TableHead>
                            <TableRow>
                                <TableCellWrapper>
                                    Open
                                </TableCellWrapper>
                                <TableCellWrapper>
                                    Item Name
                                </TableCellWrapper>
                                <TableCellWrapper>
                                    Quantity
                                </TableCellWrapper>
                                <TableCellWrapper>
                                    List Price ($)
                                </TableCellWrapper>
                                <TableCellWrapper>
                                    Date Listed
                                </TableCellWrapper>
                                <TableCellWrapper>
                                    Archive
                                </TableCellWrapper>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {itemsAndBids.length === 0 ? <div> You currently have 0 listings </div> : <div/>}
                            {itemsAndBids.map((itemAndBid) => (
                                <ListingRow itemAndBid={itemAndBid} updateMyListings={this.updateMyListings}/>
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>
            </div>
        );
    }
}

export default MyListings;