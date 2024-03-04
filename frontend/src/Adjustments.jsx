import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import ProductForm from './shared/productForm'; // Corrected the import path to match the case sensitivity
import useSnackbar from './hooks/useSnackBar';

const Adjustments = () => {
  const { productId } = useParams(); // This will be the UPC from the URL
  const [item, setItem] = useState({
    name: '',
    category: '',
    upc: '',
    quantity: 0,
    costPrice: 0,
    salePrice: 0,
    location: '',
    file: null
  });
  const [originalItem, setOriginalItem] = useState(null);
  const { open, message, showSnackbar, closeSnackbar } = useSnackbar();

  useEffect(() => {
    let isMounted = true; // Flag to check component mount status
    const fetchItemDetails = async () => {
      try {
        const response = await axios.get(`http://localhost:3030/api/item/upc/${productId}`);
        if (response.data && isMounted) { // Check if component is still mounted
          const imageResponse = await axios.get(`http://localhost:3030/api/image/id/${response.data._id}`, { responseType: 'blob' });
          const imageUrl = URL.createObjectURL(imageResponse.data);
          setItem({ ...response.data, file: imageUrl });
          setOriginalItem({ ...response.data, file: imageUrl });
        } else if (isMounted) { // Check if component is still mounted
          console.log('No item found with the given productId');
          showSnackbar('No item found.');
        }
      } catch (error) {
        if (isMounted) { // Check if component is still mounted
          console.log('Error fetching item details:', error);
          showSnackbar('Failed to fetch item details.');
        }
      }
    };

    console.log("Fetching ...");
    fetchItemDetails();

    return () => {
      isMounted = false; // Set flag to false when component unmounts
    };
  }, [productId, showSnackbar]);

  const handleChange = (updatedItem) => {
    setItem(updatedItem);
  };

  const handleSave = async (updatedItem) => {
    try {
      // const formData = new FormData();
      // Object.keys(updatedItem).forEach(key => {
      //   formData.append(key, updatedItem[key]);
      // });
// to update to take new api for multipart form
      await axios.put(`http://localhost:3030/api/item/id/${item._id}`, updatedItem, {
        headers: {
          'Content-Type': 'application/json'
        }
      });
      showSnackbar('Product details updated successfully.');
    setOriginalItem({...originalItem, ...updatedItem});
    } catch (error) {
      console.log('Error updating item details:', error);
      showSnackbar('Failed to update item details.');
    }
  };

  return (
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
  );
};

export default Adjustments;
