import React, { useState, useEffect } from 'react';
import { TextField, Button, FormControl, InputLabel, Select, MenuItem, FormHelperText, Box, Snackbar, Alert, IconButton, Avatar, Grid } from '@mui/material';
import PhotoCamera from '@mui/icons-material/PhotoCamera';
import axios from 'axios';
import useSnackbar from './hooks/useSnackBar';
import { Link } from 'react-router-dom';

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
  const [preview, setPreview] = useState(null); // Added state for image preview
  const [errors, setErrors] = useState({});
  const [isFormValid, setIsFormValid] = useState(false);
  const { open, message, showSnackbar, closeSnackbar } = useSnackbar();

  useEffect(() => {
    validateForm();
  }, [item]);

  useEffect(() => { // Added useEffect hook for updating the preview when file changes
    if (!item.file) {
      setPreview(undefined);
      return;
    }

    const objectUrl = URL.createObjectURL(item.file);
    setPreview(objectUrl);

    // Cleanup function to revoke object URL to avoid memory leaks
    return () => URL.revokeObjectURL(objectUrl);
  }, [item.file]);

  const validateForm = () => {
    let formIsValid = true;
    let newErrors = {};

    if (!item.name) {
      formIsValid = false;
      newErrors['name'] = 'Name is required';
    }

    if (!item.category) {
      formIsValid = false;
      newErrors['category'] = 'Category is required';
    }

    if (isNaN(item.quantity) || item.quantity < 0) {
      formIsValid = false;
      newErrors['quantity'] = 'Quantity must be a non-negative number';
    }

    if (isNaN(item.costPrice) || item.costPrice < 0) {
      formIsValid = false;
      newErrors['costPrice'] = 'Cost Price must be a non-negative number';
    }

    if (isNaN(item.salePrice) || item.salePrice < 0) {
      formIsValid = false;
      newErrors['salePrice'] = 'Sale Price must be a non-negative number';
    }

    if (!item.location) {
      formIsValid = false;
      newErrors['location'] = 'Location is required';
    }

    setErrors(newErrors);
    setIsFormValid(formIsValid);
  };

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (name === "file") {
      setItem({ ...item, file: files[0] });
    } else {
      setItem({ ...item, [name]: value });
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (isFormValid) {
      console.log('Form is valid', item);
      const formData = new FormData();
      Object.keys(item).forEach(key => {
        formData.append(key, item[key]);
      });
      console.log(formData);
      axios.post('http://localhost:3030/api/image', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      })
        .then(response => {
          console.log(response.data);
          showSnackbar('Item created successfully!');
          setItem(DEFAULT_FORM);
        })
        .catch(error => {
          console.log('An error occurred:', error);
          showSnackbar('Failed to create item.');
        });
    } else {
      console.log('Form is invalid', errors);
    }
  };

  return (
    <>
    
      <Box component="form" noValidate autoComplete="off" onSubmit={handleSubmit} encType="multipart/form-data">
      <Grid container spacing={2}>
      <Grid item xs={12} md={6}>
        <TextField
          margin="normal"
          fullWidth
          id="name"
          label="Name"
          name="name"
          value={item.name}
          onChange={handleChange}
          error={!!errors.name}
          helperText={errors.name || ''}
          autoComplete="name"
        />
        <FormControl fullWidth margin="normal" error={!!errors.category}>
          <InputLabel id="category-label">Category</InputLabel>
          <Select
            labelId="category-label"
            id="category"
            name="category"
            value={item.category}
            onChange={handleChange}
            label="Category"
          >
            <MenuItem value="Electronics">Electronics</MenuItem>
            <MenuItem value="Games">Games</MenuItem>
            <MenuItem value="Clothing">Clothing</MenuItem>
            <MenuItem value="Misc">Misc</MenuItem>
            <MenuItem value="Food">Food</MenuItem>
            <MenuItem value="Books">Books</MenuItem>
            <MenuItem value="Toys">Toys</MenuItem>
            <MenuItem value="Health">Health</MenuItem>
            <MenuItem value="Beauty">Beauty</MenuItem>
          </Select>
          {errors.category && <FormHelperText>{errors.category}</FormHelperText>}
        </FormControl>
        <TextField
          margin="normal"
          fullWidth
          id="upc"
          label="UPC"
          name="upc"
          type="number"
          value={item.upc}
          onChange={handleChange}
          error={!!errors.upc}
          helperText={errors.upc || ''}
          autoComplete="off"
        />
        <TextField
          margin="normal"
          fullWidth
          id="quantity"
          label="Quantity"
          name="quantity"
          type="number"
          value={item.quantity}
          onChange={handleChange}
          error={!!errors.quantity}
          helperText={errors.quantity || ''}
          autoComplete="off"
        />
        <TextField
          margin="normal"
          fullWidth
          id="costPrice"
          label="Cost Price"
          name="costPrice"
          type="number"
          value={item.costPrice}
          onChange={handleChange}
          error={!!errors.costPrice}
          helperText={errors.costPrice || ''}
          autoComplete="off"
        />
        <TextField
          margin="normal"
          fullWidth
          id="salePrice"
          label="Sale Price"
          name="salePrice"
          type="number"
          value={item.salePrice}
          onChange={handleChange}
          error={!!errors.salePrice}
          helperText={errors.salePrice || ''}
          autoComplete="off"
        />
        <TextField
          margin="normal"
          fullWidth
          id="location"
          label="Location"
          name="location"
          value={item.location}
          onChange={handleChange}
          error={!!errors.location}
          helperText={errors.location || ''}
          autoComplete="off"
        />
        </Grid>
        <Grid item xs={12} md={6} sx={{display: 'flex', flexDirection: 'column', alignItems: 'center'}}>
        <label htmlFor="icon-button-file">
          <input accept="image/*" id="icon-button-file" type="file" name="file" onChange={handleChange} style={{ display: 'none' }} />
          <Button color="primary" aria-label="upload picture" component="span" variant="contained" startIcon={<PhotoCamera />}>
            Upload Photo
          </Button>
        </label>
        {preview && <Avatar src={preview} sx={{ width: '500px', height: '500px', borderRadius: '5%', mt: 2}} />} {/* Added preview of the selected picture */}
        </Grid>
        </Grid>
        <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 2 }}>
          <Button type="submit" variant="contained" sx={{ mr: 1 }} disabled={!isFormValid}>
            Save
          </Button>
        </Box>
      </Box>
      <Snackbar open={open} autoHideDuration={6000} onClose={closeSnackbar}>
        <Alert onClose={closeSnackbar} severity="success" sx={{ width: '100%' }}>
          {message}
          <Link to="/item-library">View products</Link>
        </Alert>
      </Snackbar>
    </>
  );
};

export default CreateItem;
