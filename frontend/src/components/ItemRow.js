import React, {useState} from 'react';
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


export default function ItemRow({itemAndBid}) {
    // constructor(props) {
    //     super(props);
    //     this.state = checked;
    // }

    const {itemName, listQuant, listPrice, listDate, resolved, bids} = itemAndBid;

    console.log('item name: ', itemName);
    console.log('bids: ', bids);

    const [open, setOpen] = useState(false); // opening of collapsible table

    /* Accept and Reject bid checkboxes. */
    /* 'acceptChecked' and 'rejectChecked' are lists. */
    const [acceptChecked, setAcceptChecked] = React.useState([]);
    const [rejectChecked, setRejectChecked] = React.useState([]);

    const handleChange = (event, id, field) => { // handles checking & unchecking of checkbox
        console.log("bid id: ", id);
        const checked = event.target.checked;

        switch (field) {
            case 'acceptBid':
                if (checked) {
                    console.log("accept checked: ", acceptChecked);
                    acceptChecked.push(id);
                    setAcceptChecked(acceptChecked) // add 'id' into 'acceptChecked' list
                } else {
                    console.log("accept checked: ", acceptChecked);
                    acceptChecked.filter((bidID) => bidID !== id)
                    setAcceptChecked(acceptChecked) // filter out id from 'acceptChecked' list
                }
                break;
            case 'rejectBid':
                if (checked) {
                    setRejectChecked(rejectChecked.push(id)) // add 'id' into 'rejectChecked'
                } else {
                    setRejectChecked(rejectChecked.filter((bidID) => bidID !== id))
                }
                break;
            default:
                console.log('unrecognized')
        }
    };

    console.log(acceptChecked)
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
                        <Checkbox inputProps={{ 'aria-label': 'uncontrolled-checkbox' }}
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
                                        {bids.length === 0 ? <div>
                                            No bids
                                        </div> : <div/>}
                                        {bids.map(bid => (
                                            <TableRow
                                                key={bid.bidId}
                                            >
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
                                                        <div>
                                                            <Checkbox inputProps={{ 'aria-label': 'uncontrolled-checkbox' }}
                                                                      // if bid.id is in acceptChecked (i.e. it has been accepted, checked becomes true
                                                                      checked={acceptChecked.includes(bid.bidId)}
                                                                      onChange={(e) => handleChange(e, bid.bidId, 'acceptBid')}
                                                            />
                                                        </div>
                                                    </TableCell>
                                                    <TableCell align="right">
                                                        {bid.rejectBid}
                                                        <div align={"left"}>
                                                            <Checkbox inputProps={{ 'aria-label': 'uncontrolled-checkbox' }}
                                                                      checked={rejectChecked.includes(bid.bidId)}
                                                                      onChange={(e) => handleChange(e, 'rejectBid')}
                                                            />
                                                        </div>
                                                    </TableCell>
                                                </React.Fragment>

                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            </TableContainer>
                        </Box>
                    </Collapse>
                </TableCell>
            </TableRow>
        </React.Fragment>
    )
}
