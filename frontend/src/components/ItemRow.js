import React, {useEffect, useState} from 'react';
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
import {TableCellWrapper} from "./Helpers";
import Checkbox from '@material-ui/core/Checkbox';
import Button from '@material-ui/core/Button';
import TextField from "@material-ui/core/TextField";
import {IOptions as classes} from "glob";


export default function ItemRow({itemAndBid}) { // destructuring in place (from props). alternative is const {itemAndBid} = props;
    const {itemName, listQuant, listPrice, listDate, resolved, bids} = itemAndBid; // destructuring

    console.log('item name: ', itemName);
    console.log('bids: ', bids);

    const [open, setOpen] = useState(false); // opening of collapsible table

    /* 'acceptChecked' and 'rejectChecked' are lists. */
    const [acceptChecked, setAcceptChecked] = React.useState([]);
    const [rejectChecked, setRejectChecked] = React.useState([]);
    // useEffect(() => {console.log(acceptChecked)}, [acceptChecked]);

    // this is a lambda instead of a function because we're already in a function
    const handleChange = (event, id, field) => { // handles checking & unchecking of checkbox
        // browser controls 'event' and passes the correct values to us
        const checked = event.target.checked; // target describes thing operated on (e.g. textbox, checkbox, etc.)
        console.log("checked: ", checked)

        switch (field) {
            case 'acceptBid':
                if (checked) {
                    const updatedAcceptChecked = acceptChecked.concat([id]) // add 'id' into 'acceptChecked' list
                    setAcceptChecked(updatedAcceptChecked)
                } else { // unchecked
                    const updatedAcceptChecked = acceptChecked.filter((bidID) => bidID !== id) // only keep item ids that weren't accepted
                    console.log("id: ", id);
                    console.log("acceptChecked: ", acceptChecked);
                    setAcceptChecked(updatedAcceptChecked) // filter out id from 'acceptChecked' list
                }
                break;
            case 'rejectBid':
                if (checked) {
                    const updatedRejectChecked = rejectChecked.concat([id])
                    setRejectChecked(updatedRejectChecked)
                } else {
                    const updatedRejectChecked = rejectChecked.filter((bidID) => bidID !== id)
                    setRejectChecked(updatedRejectChecked)
                }
                break;
            default:
                console.log('unrecognized')
        }
    };
    console.log("accept checked: ", acceptChecked);
    console.log("reject checked: ", rejectChecked);

    const handleSave = () => {
        const body = {
            acceptedBids: acceptChecked,
            rejectedBids: rejectChecked,
        };
        fetch('http://127.0.0.1:5000/saveBidResults',
            {
                method: 'POST',
                body: JSON.stringify(body), // body is originally a JS object, but this body needs to receive a JSON string
                headers: {
                    'Content-Type': 'application/json' // tells receiver (endpoint) what type 'body' is
                }
            }
        )
    }


    return (
        <React.Fragment>
            <TableRow>
                <TableCell>
                    <IconButton aria-label="expand row" size="small" onClick={() => setOpen(!open)}>
                        {open ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
                    </IconButton>
                </TableCell>
                <TableCell>
                    {itemName}
                </TableCell>
                <TableCell>
                    {listQuant}
                </TableCell>
                <TableCell>
                    {listPrice}
                </TableCell>
                <TableCell>
                    {listDate}
                </TableCell>
                <TableCell align="right">
                    {resolved}
                    <div align={"left"}>
                        <Checkbox
                            inputProps={{ 'aria-label': 'uncontrolled-checkbox' }}
                            onChange={(e) => handleChange(e, 'accept')}
                        />
                    </div>
                </TableCell>
            </TableRow>
            <TableRow>
                <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={6}>
                    <Collapse in={open}>
                        <Box margin={1}>
                            <Typography variant="h6" gutterBottom component="div">
                                Bids
                            </Typography>
                            <TableContainer component={Paper}>
                                <Table size="small" aria-label="purchases">
                                    <TableHead>
                                        <TableRow>
                                            <TableCellWrapper/>
                                            <TableCellWrapper>
                                                Date
                                            </TableCellWrapper>
                                            <TableCellWrapper>
                                                Bidder/Customer
                                            </TableCellWrapper>
                                            <TableCellWrapper>
                                                Quantity
                                            </TableCellWrapper>
                                            <TableCellWrapper>
                                                Bid Price
                                            </TableCellWrapper>
                                            <TableCellWrapper>
                                                Accept
                                            </TableCellWrapper>
                                            <TableCellWrapper>
                                                Reject
                                            </TableCellWrapper>
                                        </TableRow>
                                    </TableHead>
                                    <TableBody>
                                        {console.log('bids: ', bids)}
                                        {bids.length === 0 ? <div> No bids </div> : <div/>}
                                        {bids.map(bid => (
                                            <TableRow key={bid.bidId}>
                                                <TableCell/>
                                                <TableCell>
                                                    {bid.bidDate}
                                                </TableCell>
                                                <TableCell>
                                                    {bid.bidder}
                                                </TableCell>
                                                <TableCell>
                                                    {bid.bidQuant}
                                                </TableCell>
                                                <TableCell>
                                                    {bid.bidPrice}
                                                </TableCell>
                                                <React.Fragment>
                                                    <TableCell>
                                                        {bid.acceptBid}
                                                        <div style={{width: '100px'}}>
                                                            <form>
                                                                <TextField
                                                                    id="outlined-basic"
                                                                    label="quantity"
                                                                    variant="outlined"
                                                                    size="small"

                                                                />
                                                            </form>
                                                        </div>
                                                    </TableCell>
                                                    <TableCell align="right">
                                                        {bid.rejectBid}
                                                        <div align={"left"}>
                                                            <Checkbox
                                                                inputProps={{ 'aria-label': 'uncontrolled-checkbox' }}
                                                                // if bid.id is in rejectChecked (i.e. it has been rejected), checked becomes true
                                                                checked={rejectChecked.includes(bid.bidId)} // controlled component
                                                                onChange={(e) => handleChange(e, bid.bidId, 'rejectBid')}
                                                            />
                                                        </div>
                                                    </TableCell>
                                                </React.Fragment>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                                <div style={{display: 'flex', width: '500', flexDirection: 'row-reverse'}}>
                                    <Button
                                        variant="outlined"
                                        onClick={() => handleSave()}>Save</Button>
                                </div>
                            </TableContainer>
                        </Box>
                    </Collapse>
                </TableCell>
            </TableRow>
        </React.Fragment>
    )
}
