import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { Autocomplete, TextField } from '@mui/material';
import HistoryTable from './HistoryTable';

const AdjustmentsSelection = () => {
  const [products, setProducts] = useState([]);
  const [history, setHistory] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    let isMounted = true;
    const fetchProducts = async () => {
      try {
        const response = await axios.get(`${process.env.REACT_APP_BASE_URL}/api/item`);
        if (response.data && isMounted) {
        setProducts(response.data);
    } else if (isMounted) {
        console.log('No item found with the given productId');
      }
      } catch (error) {
        if (isMounted) {
            console.log('Error fetching item details:', error);
          }
      }
    };

    fetchProducts();
    return () => {
        isMounted = false;
      };
  }, []);

  useEffect(() => {
    let isMounted = true;
    const fetchHistory = async () => {
      try {
        const response = await axios.get(`${process.env.REACT_APP_BASE_URL}/api/item/query`); //update endpoint
        if (response.data && isMounted) {
        setHistory(response.data);
    } else if (isMounted) {
        console.log('No item found with the given productId');
      }
      } catch (error) {
        if (isMounted) {
            console.error('Error fetching history:', error);
          }
      }
    };

    fetchHistory();
    return () => {
        isMounted = false;
      };
 }, []);

  const handleProductSelection = (event, value) => {
    if (value && value.upc) {
      navigate(`/adjustments/${value.upc}`);
    } else {
      console.log('No product selected');
    }
  };

  return (
    <>
      {products.length > 0 && (
        <Autocomplete
        options={products}
        getOptionLabel={(option) => `${option.name} (${option.upc})`}
        style={{ width: 300 }}
        onChange={handleProductSelection}
        filterOptions={(options, state) => {
          return options.filter(option =>
            option.name.toLowerCase().includes(state.inputValue.toLowerCase()) ||
            option.upc.toString().includes(state.inputValue)
          );
        }}
        renderInput={(params) => <TextField {...params} label="Search by name or UPC" variant="outlined" />}
      /> 
      )}
      <HistoryTable historyArray={history} />
    </>
  );
};

export default AdjustmentsSelection;
