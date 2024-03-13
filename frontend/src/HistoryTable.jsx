import React from 'react';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Typography } from '@mui/material';

const HistoryTable = ({ historyArray }) => {
  return (
    <TableContainer component={Paper}>
      <Table aria-label="history table">
        <TableHead>
          <TableRow>
            <TableCell style={{ fontWeight: 'bold', fontSize: '18px' }}>Name (UPC)</TableCell>
            <TableCell style={{ fontWeight: 'bold', fontSize: '18px' }}>Description</TableCell>
            <TableCell style={{ fontWeight: 'bold', fontSize: '18px' }}>User</TableCell>
            <TableCell style={{ fontWeight: 'bold', fontSize: '18px' }}>Time</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {historyArray.length > 0 ? (
            historyArray.map((entry) => (
              <TableRow key={entry._id}>
                <TableCell style={{ fontSize: '16px' }}>{`${entry.name} (${entry.upc})`}</TableCell>
                <TableCell style={{ fontSize: '16px' }}>{entry.description}</TableCell>
                <TableCell style={{ fontSize: '16px' }}>{entry.user}</TableCell>
                <TableCell style={{ fontSize: '16px' }}>{new Date(entry.timestamp).toLocaleString()}</TableCell>
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={4} align="center">
                <Typography variant="subtitle1" style={{ fontStyle: 'italic' }}>
                  No history available
                </Typography>
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default HistoryTable;

