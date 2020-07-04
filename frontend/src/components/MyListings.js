import React from 'react';
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/core/styles';
import Box from '@material-ui/core/Box';
import Collapse from '@material-ui/core/Collapse';
import IconButton from '@material-ui/core/IconButton';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Typography from '@material-ui/core/Typography';
import Paper from '@material-ui/core/Paper';
import KeyboardArrowDownIcon from '@material-ui/icons/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@material-ui/icons/KeyboardArrowUp';
import ItemRow from './ItemRow'


class MyListings extends React.Component {
    componentDidMount() {
        const {userID} = this.props;
        const body = {
            userID: userID,
        };
        fetch('http://127.0.0.1:5000/getMyItems',
            {
                method: 'POST',
                body:JSON.stringify(body),
                headers: {
                    'Content-Type': 'application/json'
                }
            })
            .then(response => {
                console.log(response)
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
            console.log('no data', x)
            return('no data')
        })
    }

    constructor(props) {
        super(props);
        this.state = {
            itemsAndBids: [],
        };
        // this.state = {
        //     itemsAndBids: [
        //         {
        //             itemName: 'water bottle',
        //             listQuant: '6',
        //             listPrice: '2.99',
        //             listDate: 'monday',
        //             resolved: false,
        //             bids: [
        //                 {
        //                     bidDate: 'april',
        //                     bidder: 'aspyn',
        //                     bidQuant: '2',
        //                     bidPrice: '2.99',
        //                     acceptBid: false,
        //                     rejectBid: false,
        //                 }
        //             ]
        //         },
        //         {
        //             itemName: 'mason jars',
        //             listQuant: '12',
        //             listPrice: '3.99',
        //             listDate: 'monday',
        //             resolved: false,
        //             bids: [
        //                 {
        //                     bidDate: 'april',
        //                     bidder: 'mickey',
        //                     bidQuant: '3',
        //                     bidPrice: '3.99',
        //                     acceptBid: false,
        //                     rejectBid: false,
        //                 }
        //             ]
        //         }
        //     ]
        // }
    }



    render() {
        const {itemsAndBids} = this.state;
        console.log('items and bids: ', itemsAndBids);
        return (
            <div>
                <h1>My Account</h1>
                <TableContainer component={Paper}>
                    <Table aria-label="collapsible table">
                        <TableHead>
                            <TableRow>
                                <TableCell>
                                    Open
                                </TableCell>
                                <TableCell>
                                    Item Name
                                </TableCell>
                                <TableCell>
                                    Quantity
                                </TableCell>
                                <TableCell>
                                    List Price ($)
                                </TableCell>
                                <TableCell>
                                    Date Listed
                                </TableCell>
                                <TableCell>
                                    Resolved
                                </TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {itemsAndBids.map((itemAndBid) => (
                                <ItemRow itemAndBid={itemAndBid}/>
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>
            </div>
        );
    }
}

export default MyListings;