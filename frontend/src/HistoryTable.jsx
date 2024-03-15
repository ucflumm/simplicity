import React from 'react';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper } from '@mui/material';

const HistoryTable = ({ historyArray }) => {
  console.log(historyArray);
  return (
    <TableContainer component={Paper}>
      <Table aria-label="history table">
        <TableHead>
          <TableRow>
            <TableCell>Name (UPC)</TableCell>
            <TableCell>Description</TableCell>
            <TableCell>User</TableCell>
            <TableCell>Time</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {historyArray.map((entry) => (
            <TableRow key={entry._id}>
              <TableCell>{`${entry.name} (${entry.upc})`}</TableCell>
              <TableCell>{entry.description}</TableCell>
              <TableCell>{entry.user}</TableCell>
              <TableCell>{new Date(entry.timestamp).toLocaleString()}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default HistoryTable;

