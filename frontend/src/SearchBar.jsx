import React from 'react';
import { TextField, Box } from '@mui/material';

const SearchBar = ({ setSearchTerm }) => {
  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);
  };

  return (
    <Box sx={{ display: 'flex', justifyContent: 'center', p: 2 }}>
      <TextField
        variant="outlined"
        placeholder="Search by Name or UPC"
        onChange={handleSearchChange}
      />
    </Box>
  );
};

export default SearchBar;