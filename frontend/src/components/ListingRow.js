import React, {useEffect, useState} from 'react';
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
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';

export default function ListingRow({itemAndBid, updateMyListings, updateQuantRemaining}) { // destructuring in place (from props). alternative is const {itemAndBid} = props;
    const {itemId, itemName, listQuant, listPrice, listDate, resolved, bids} = itemAndBid; // destructuring

    const [openTable, setOpenTable] = useState(false); // opening of collapsible table
    const [openArchiveMessage, setOpenArchiveMessage] = useState(false);
    const [openInvalidAcceptQuantMsg, setOpenInvalidAcceptQuantMsg] = useState(false);
    const [updatedBids, setUpdatedBids] = useState([]);

    useEffect(() => {
        const updatedBids = bids.map((bid) => {
            bid.acceptQuant = 0;
            bid.rejected = false;
            return bid;
        });
        setUpdatedBids(updatedBids);
    }, []);

    // this is a lambda instead of a function because we're already in a function
    const handleChange = (event, id, field) => {
        // browser controls 'event' and passes the correct values to us
        const checked = event.target.checked; // target describes thing operated on (e.g. textbox, checkbox, etc.)
        const acceptQuant = event.target.value;

        switch (field) {
            case 'acceptBid':
                const tempUpdatedBids1 = [];
                for (let i = 0; i < updatedBids.length; i++) {
                    if (updatedBids[i].bidId === id) {
                        updatedBids[i].acceptQuant = acceptQuant;
                    } else {
                        console.log("The quantity you accept must be > 0.")
                    }
                    tempUpdatedBids1.push(updatedBids[i]);
                }
                setUpdatedBids(tempUpdatedBids1);
                break;
            case 'rejectBid':
                const tempUpdatedBids2 = [];
                if (checked) {
                    for (let i = 0; i < updatedBids.length; i++) {
                        if (updatedBids[i].bidId === id) {
                            updatedBids[i].rejected = true;
                        }
                        tempUpdatedBids2.push(updatedBids[i]);
                    }
                } else { // unchecking 'reject' checkbox
                    for (let i = 0; i < updatedBids.length; i++) {
                        if (updatedBids[i].bidId === id) {
                            updatedBids[i].rejected = false;
                        }
                        tempUpdatedBids2.push(updatedBids[i]);
                    }
                }
                setUpdatedBids(tempUpdatedBids2);
                break;
            default:
                console.log('unrecognized')
        }
    };

    const handleSave = () => {
        const archiveDate = new Date();
        console.log("bids: ", bids);
        const body = {
            itemId: itemId,
            bids: bids,
            archived: archiveItem(),
            archiveDate: archiveDate.toDateString(),
        };
        if (!validTotalAcceptQuant()) {
            setOpenInvalidAcceptQuantMsg(true);
            return;
        }
        if (archiveItem()) {
            setOpenArchiveMessage(true);
            updateMyListings();
        }
        fetch('http://127.0.0.1:5000/saveBidResults',
            {
                method: 'POST',
                body: JSON.stringify(body), // body is originally a JS object, but this body needs to receive a JSON string
                headers: {
                    'Content-Type': 'application/json' // tells receiver (endpoint) what type 'body' is
                }
            }
        ).then(response => response.status)
            .then(status => {
                if (status !== 200){
                    console.log('big bad');
                } else {
                    console.log('success');
                    updateQuantRemaining(itemId, bids);
                }
            }).catch(x => {
                console.log('no data', x);
                return ('no data')
            });
    };

    // Purpose: Returns true if button should remain disabled
    const buttonDisabled =
        updatedBids.filter(bid =>
            (bid.acceptQuant === 0 && !bid.rejected)
             || (bid.acceptQuant > 0 && bid.rejected) || (bid.acceptQuant === '' && !bid.rejected)).length !== 0;

    // Purpose: Returns true if sum of all accepted quantities equals the quantity of item listed for sale
    const archiveItem = () => {
        return (updatedBids.length === 0 ? false :
            (updatedBids.reduce((totalAcceptQuant, bid) =>
                totalAcceptQuant + parseInt(bid.acceptQuant), 0) === parseInt(listQuant)));
    };

    // Purpose: Returns true if sum of all accepted quantities is <= quantity of item listed for sale
    const validTotalAcceptQuant = () => {
        return (updatedBids.length === 0 ? false :
            (updatedBids.reduce((totalAcceptQuant, bid) =>
                totalAcceptQuant + parseInt(bid.acceptQuant), 0) <= parseInt(listQuant)));
    };

    return (
        <React.Fragment>
            <TableRow>
                <TableCell>
                    <IconButton aria-label="expand row" size="small" onClick={() => setOpenTable(!openTable)}>
                        {openTable ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
                    </IconButton>
                </TableCell>
                <TableCell>
                    {itemName}
                </TableCell>
                <TableCell>
                    {listQuant}
                </TableCell>
                <TableCell>
                    ${listPrice}
                </TableCell>
                <TableCell>
                    {listDate}
                </TableCell>
                <TableCell align="right">
                    {resolved}
                    <div align={"left"}>
                        <Checkbox
                            onChange={(e) => handleChange(e, 'resolve')}
                        />
                    </div>
                </TableCell>
            </TableRow>
            <TableRow>
                <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={6}>
                    <Collapse in={openTable}>
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
                                        {updatedBids.length === 0 ? <div> No bids </div> : <div/>}
                                        {updatedBids.map(bid => (
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
                                                    ${bid.bidPrice}
                                                </TableCell>
                                                <React.Fragment>
                                                    <TableCell>
                                                        <div style={{width: '100px'}}>
                                                            <form>
                                                                <TextField
                                                                    id="outlined-basic"
                                                                    label="quantity"
                                                                    variant="outlined"
                                                                    size="small"
                                                                    value={bid.acceptQuant} // controlled component
                                                                    onChange={(e) => handleChange(e, bid.bidId, 'acceptBid')}
                                                                />
                                                            </form>
                                                        </div>
                                                    </TableCell>
                                                    <TableCell align="right">
                                                        <div align={"left"}>
                                                            <Checkbox
                                                                checked={bid.rejected} // controlled component
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
                                    <Button disabled={buttonDisabled} variant="outlined" onClick={() => handleSave()}>
                                        Save
                                    </Button>
                                    <Dialog
                                        open={openArchiveMessage}
                                        onClose={() => setOpenArchiveMessage(false)}
                                    >
                                        <DialogTitle id="alert-dialog-title">{"Archive Message"}</DialogTitle>
                                        <DialogContent>
                                            <DialogContentText id="alert-dialog-description">
                                                You are about to sell all available quantities of this item. This
                                                item and its associated bid(s) will now be moved to Archives.
                                            </DialogContentText>
                                        </DialogContent>
                                        <DialogActions>
                                            <Button onClick={() => setOpenArchiveMessage(false)} color="primary" autoFocus>
                                                Ok
                                            </Button>
                                        </DialogActions>
                                    </Dialog>
                                    <Dialog
                                        open={openInvalidAcceptQuantMsg}
                                        onClose={() => setOpenInvalidAcceptQuantMsg(false)}
                                    >
                                        <DialogTitle id="alert-dialog-title">{"Invalid Accept Quantity"}</DialogTitle>
                                        <DialogContent>
                                            <DialogContentText id="alert-dialog-description">
                                                You are trying to sell more than you have. Please make sure you only
                                                sell at most what you have listed as available.
                                            </DialogContentText>
                                        </DialogContent>
                                        <DialogActions>
                                            <Button onClick={() => setOpenInvalidAcceptQuantMsg(false)} color="primary" autoFocus>
                                                Ok
                                            </Button>
                                        </DialogActions>
                                    </Dialog>
                                </div>
                            </TableContainer>
                        </Box>
                    </Collapse>
                </TableCell>
            </TableRow>
        </React.Fragment>
    )
}
