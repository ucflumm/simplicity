import React from 'react';
import TextField from '@mui/material/TextField';
import Autocomplete from '@mui/material/Autocomplete';

// Dummy data for the autocomplete options
const searchOptions = [
  { label: 'Option 1', id: 1 },
  { label: 'Option 2', id: 2 },
  { label: 'Option 3', id: 3 },
  // Add more options as needed
];

function SearchBar() {
  // Placeholder for search logic
  const handleSearch = (event, value) => {
    // Implement your search logic here
    // 'value' is the selected option from the autocomplete
    console.log('Selected option:', value);
  };

  return (
    <Autocomplete
      disablePortal
      id="search-autocomplete"
      options={searchOptions}
      sx={{ width: 300 }}
      renderInput={(params) => <TextField {...params} label="Search" />}
      onChange={handleSearch} // Trigger search logic on selection
    />
  );
}

export default SearchBar;
