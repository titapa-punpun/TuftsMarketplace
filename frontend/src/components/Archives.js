import React from 'react';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';
import ArchiveItemRow from './ArchiveItemRow'
import {TableCellWrapper} from './Helpers'

class Archives extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            archivedItems: [],
        };
    }

    componentDidMount() {
        const {userID} = this.props;
        const body = {
            userID: userID,
        };
        fetch('http://127.0.0.1:5000/getArchives',
            {
                method: 'POST',
                body: JSON.stringify(body),
                headers: {
                    'Content-Type': 'application/json'
                }
            })
            .then(response => {
                if (response.status !== 200) {
                    console.log('status was not 200, was', response.status)
                } else {
                    return response;
                }
            }).then(response => response.json())
            .then(json => {
                console.log("json response: ", json);
                this.setState({
                    archivedItems: json['allArchivedItems'],
                })
            }).catch(x => {
            console.log('no data', x);
            return('no data')
        })
    }

    render() {
        const {archivedItems} = this.state;
        console.log('archivedItems: ', archivedItems);
        return (
            <div>
                <h2>Archives</h2>
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
                                    Date Archived
                                </TableCellWrapper>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {archivedItems.map((archivedItem) => (
                                <ArchiveItemRow archivedItem={archivedItem}/>
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>
            </div>
        );
    }
}

export default Archives;