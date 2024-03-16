import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom'; // Added useNavigate for navigation
import axios from 'axios';
import ProductForm from './shared/productForm'; // Corrected the import path to match the case sensitivity
import useSnackbar from './hooks/useSnackBar';
import { Button, Box /*, CircularProgress*/ } from '@mui/material'; // Import Button and commented out CircularProgress from MUI
import HistoryTable from './HistoryTable';

const Adjustments = () => {
  const { productId } = useParams(); // This will be the UPC from the URL
  const navigate = useNavigate(); // Hook for navigation
  const [history, setHistory] = useState([]); // state for history adjs
  const [item, setItem] = useState({
    name: '',
    category: '',
    upc: '',
    quantity: 0,
    costPrice: 0,
    salePrice: 0,
    location: '',
    file: null,
    user: 'Web-Client'
  });
  const [originalItem, setOriginalItem] = useState(null);
  // const [loading, setLoading] = useState(false); // State to manage loading state
  const { open, message, showSnackbar, closeSnackbar } = useSnackbar();

  const fetchItemDetails = useCallback(async () => {
    let isMounted = true;
    // setLoading(true); // Set loading to true when fetching starts
    try {
      const response = await axios.get(`${process.env.REACT_APP_BASE_URL}/api/item/upc/${productId}`);
      if (response.data && isMounted) {
        const imageResponse = await axios.get(`${process.env.REACT_APP_BASE_URL}/api/image/id/${response.data._id}`, { responseType: 'blob' });
        const imageUrl = URL.createObjectURL(imageResponse.data);
        setItem({ ...response.data, file: imageUrl });
        setOriginalItem({ ...response.data, file: imageUrl });
      } else if (isMounted) {
        console.log('No item found with the given productId');
        showSnackbar('No item found.');
      }
    } catch (error) {
      if (isMounted) {
        console.log('Error fetching item details:', error);
        showSnackbar('Failed to fetch item details.');
      }
    } finally {
      // if (isMounted) {
      //   setLoading(false); // Set loading to false when fetching ends
      // }
    }
    return () => {
      isMounted = false;
    };
  }, [productId, showSnackbar, /* setLoading, */ setItem, setOriginalItem]);

  useEffect(() => {
    fetchItemDetails();
  }, [fetchItemDetails]);

  const fetchHistory = useCallback(async () => {
    let isMounted = true;
    // setLoading(true); // Set loading to true when fetching starts
    try {
      if (item._id && item._id !== '') {
        const response = await axios.get(`${process.env.REACT_APP_BASE_URL}/api/item/query/id/${item._id}`); //update endpoint
        if (response.data && isMounted) {
          setHistory(response.data);
        } else if (isMounted) {
          console.log('No item found with the given productId');
        }
      }
    } catch (error) {
      if (isMounted) {
        console.error('Error fetching history:', error);
      }
    } finally {
      // if (isMounted) {
      //   setLoading(false); // Set loading to false when fetching ends
      // }
    }
    return () => {
      isMounted = false;
    };
  }, [item._id]);

  useEffect(() => {
    fetchHistory();
  }, [fetchHistory]);

  const handleChange = (updatedItem) => {
    setItem(updatedItem);
  };

  const handleSave = async (updatedItem) => {
    // setLoading(true); // Set loading to true when saving starts
    try {
      const formData = new FormData();
      Object.keys(updatedItem).forEach(key => {
        formData.append(key, updatedItem[key]);
      });
      // Define the user key beforehand as instructed
      const user = "Web-Client"; // Assuming "Web-Client" is the predefined user
      formData.append('user', user);

      await axios.put(`${process.env.REACT_APP_BASE_URL}/api/image/id/${item._id}`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data' // Changed to 'multipart/form-data' to correctly handle FormData
        }
      });
      showSnackbar('Product details updated successfully.');
      fetchHistory();
      setOriginalItem({ ...originalItem, ...updatedItem, user }); // Include the 'user' key in the originalItem update
    } catch (error) {
      console.log('Error updating item details:', error);
      showSnackbar('Failed to update item details.');
    } finally {
      // setLoading(false); // Set loading to false when saving ends
    }
  };

  // Function to handle back navigation
  const handleBack = () => {
    navigate(-1); // Navigate back to the previous page
  };

  return (
    <>
      <Button variant="contained" onClick={handleBack} style={{ marginBottom: '20px' }}>Back</Button> {/* Back button */}
      {/* {loading ? (
        <Box display="flex" justifyContent="center">
          {/* <CircularProgress color="purple" /> */} {/* Circular progress in purple color commented out */}
        {/* </Box>
      ) : ( */}
        <ProductForm
          initialFormState={item}
          onSubmit={handleSave}
          onChange={handleChange}
          mode="adjust"
          openSnackbar={showSnackbar}
          closeSnackbar={closeSnackbar}
          snackbarMessage={message}
          snackbarOpen={open}
          originalItem={originalItem}
        />
      {/* )} */}
      <Box sx={{ marginTop: '56px' }}>
        <HistoryTable historyArray={history} />
      </Box>
    </>
  );
};

export default Adjustments;
