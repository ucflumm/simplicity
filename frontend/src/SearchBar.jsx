import React, { useState } from 'react';

const SearchComponent = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [searchType, setSearchType] = useState('name'); // default search type

  const handleInputChange = (event) => {
    setSearchTerm(event.target.value);
  };

  const handleSearchTypeChange = (event) => {
    setSearchType(event.target.value);
  };

  const handleSearch = async (event) => {
    event.preventDefault();
    const encodedSearchTerm = encodeURIComponent(searchTerm);
    let apiUrl;

    // Change the API URL based on the search type
    if (searchType === 'upc') {
      apiUrl = `https://your-api-url.com/api/item/upc/${encodedSearchTerm}`;
    } else {
      apiUrl = `https://your-api-url.com/api/item/search/${encodedSearchTerm}`;
    }

    try {
      const response = await fetch(apiUrl);
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      const data = await response.json();
      setSearchResults(data);
    } catch (error) {
      console.error('There was a problem with the fetch operation:', error);
    }
  };

  return (
    <div>
      <form onSubmit={handleSearch}>
        {/* Dropdown for search type */}
        <select value={searchType} onChange={handleSearchTypeChange}>
          <option value="name">Name</option>
          <option value="upc">UPC</option>
        </select>
        
        {/* Search input */}
        <input
          type="text"
          value={searchTerm}
          onChange={handleInputChange}
          placeholder={`Search by ${searchType.toUpperCase()}`}
        />
        <button type="submit">Search</button>
      </form>

      {/* Display search results */}
      <ul>
        {searchResults.map((item) => (
          <li key={item.id}>{item.name} - {item.upc}</li>
        ))}
      </ul>
    </div>
  );
};

export default SearchComponent;
