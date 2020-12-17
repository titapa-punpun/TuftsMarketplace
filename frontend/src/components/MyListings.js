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
import {TableCellWrapper} from './Helpers'

class MyListings extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            itemsAndBids: [],
        };
    }

    componentDidMount() {
        const {userID} = this.props;
        console.log("this.props: ", this.props);
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
                                    Resolve
                                </TableCellWrapper>
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