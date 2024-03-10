import React, { useState } from 'react';
import ProductForm from './shared/productForm';
import axios from 'axios';
import useSnackbar from './hooks/useSnackBar';

const DEFAULT_FORM = {
  name: '',
  category: 'Misc',
  upc: '',
  quantity: 0,
  costPrice: 0,
  salePrice: 0,
  location: '',
  file: null,
}

const CreateItem = () => {
  const [item, setItem] = useState(DEFAULT_FORM);
  const { showSnackbar, closeSnackbar, open, message } = useSnackbar();

  const handleSubmit = async (item) => {
    console.log('Form is valid', item);
    const formData = new FormData();
    Object.keys(item).forEach(key => {
      formData.append(key, item[key]);
    });
    console.log(formData);
    axios.post(`${process.env.REACT_APP_BASE_URL}/api/image`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    })
      .then(response => {
        console.log(response.data);
        showSnackbar('Item created successfully!');
        setItem(DEFAULT_FORM); // Reset form after successful submission
      })
      .catch(error => {
        console.log('An error occurred:', error);
        showSnackbar('Failed to create item.');
      });
  };

  const handleChange = (updatedItem) => {
    setItem(updatedItem);
  };

  return (
    <ProductForm 
      initialFormState={item} 
      onSubmit={handleSubmit} 
      onChange={handleChange} 
      mode="Create"
      openSnackbar={open}
      closeSnackbar={closeSnackbar}
      snackbarMessage={message}
      snackbarOpen={open}
    />
  );
};

export default CreateItem;
