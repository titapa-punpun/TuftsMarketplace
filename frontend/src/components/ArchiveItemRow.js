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

export default function ListingItemRow({itemAndBid}) { // destructuring in place (from props). alternative is const {itemAndBid} = props;
    // console.log("itemAndBid: ", itemAndBid);
    const {itemId, itemName, listQuant, listPrice, listDate, resolved, bids} = itemAndBid; // destructuring

    const [openTable, setOpenTable] = useState(false); // opening of collapsible table

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
                    {listPrice}
                </TableCell>
                <TableCell>
                    {listDate}
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
                                                Status
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
                                                    {bid.bidPrice}
                                                </TableCell>
                                                <TableCell>
                                                    Status Here
                                                </TableCell>
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
