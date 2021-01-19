import TableCell from "@material-ui/core/TableCell/TableCell";
import React from "react";

export const TableCellWrapper = ({children}) => (
    <TableCell style={{
        fontWeight: 'bold',
    }}>
        {children}
    </TableCell>
)