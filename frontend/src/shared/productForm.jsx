import React, { useState, useEffect } from 'react';
import { TextField, Button, FormControl, InputLabel, Select, MenuItem, FormHelperText, Box, Snackbar, Alert, IconButton, Avatar, Grid, Typography } from '@mui/material';
import PhotoCamera from '@mui/icons-material/PhotoCamera';
import axios from 'axios';
import useSnackbar from '../hooks/useSnackBar';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';

const DEFAULT_FORM = {
  name: '',
  category: 'Misc',
  upc: '',
  quantity: 0,
  costPrice: 0,
  salePrice: 0,
  location: '',
  file: null,
};

const ProductForm = ({ initialFormState = DEFAULT_FORM, onSubmit, onChange, mode, openSnackbar, closeSnackbar, snackbarMessage, snackbarOpen, originalItem = null }) => {
  
  const [item, setItem] = useState(initialFormState);
  const [preview, setPreview] = useState(null);
  const [errors, setErrors] = useState({});
  const [isFormValid, setIsFormValid] = useState(false);
  const hookOpenSnackbar = openSnackbar;
  const hookCloseSnackbar = closeSnackbar;
  const hookSnackbarOpen = snackbarOpen;
  const hookSnackbarMessage = snackbarMessage;

  useEffect(() => {
    setItem(initialFormState);
  }, [initialFormState]);

  useEffect(() => {
    validateForm();
  }, [item]);

  useEffect(() => {
    if (!item.file) {
      setPreview(null);
      return;
    }
    // Check if item.file is already a URL string (begins with "blob:" or "http")
    if (typeof item.file === 'string' && (item.file.startsWith('blob:') || item.file.startsWith('http'))) {
      setPreview(item.file);
    } else if (item.file instanceof Blob) {
      // If item.file is a Blob, convert it to a data URL for preview
      const fileReader = new FileReader();
      fileReader.onloadend = () => {
        setPreview(fileReader.result);
      };
      fileReader.readAsDataURL(item.file);
    } else {
      console.error('The provided file is neither a Blob nor a valid URL.');
    }
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

    if (originalItem) {
      if (originalItem.quantity == item.quantity) {
        formIsValid = false;
        newErrors['quantity'] = 'Quantity must have a different value than the actual value';
      }
    }

    if (isNaN(item.quantity) || item.quantity < 0) {
      formIsValid = false;
      newErrors['quantity'] = 'Quantity must be a non-negative number';
    }

    // if (!item.costPrice) {
    //   formIsValid = false;
    //   newErrors['costPrice'] = 'Cost Price must have a value';
    // }

    if (isNaN(item.costPrice) || item.costPrice < 0) {
      formIsValid = false;
      newErrors['costPrice'] = 'Cost Price must be a non-negative number';
    }

    // if (!item.salePrice) {
    //   formIsValid = false;
    //   newErrors['salePrice'] = 'Sale Price must have a value';
    // }

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

  const displayData = (key) => {
    if (originalItem) {
    if (item[key] != "" && originalItem[key] != item[key]) {
      return (
        <>
          <Typography component="span" sx={{ display: 'flex', alignItems: 'center' }}>
            <span style={{ textDecoration: 'line-through', color: 'red' }}>
              {originalItem[key]}
            </span>
            <ArrowForwardIosIcon sx={{ fontSize: "1rem", mx: 0.5 }} />
            <span>
              {item[key]}
            </span>
          </Typography>
        </>
      )
    }
    }
    return <Typography component="span">{item[key]}</Typography>
  }
  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (name === "file") {
      setItem({ ...item, file: files[0] });
    } else {
      setItem({ ...item, [name]: value });
    }
    if (onChange) onChange({ ...item, [name]: name === "file" ? files[0] : value });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (onSubmit) onSubmit(item);
  };

  if (mode === "Create") {
    return (
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
        <Snackbar open={hookSnackbarOpen} autoHideDuration={6000} onClose={hookCloseSnackbar}>
          <Alert onClose={hookCloseSnackbar} severity="success" sx={{ width: '100%' }}>
            {hookSnackbarMessage}
          </Alert>
        </Snackbar>
      </Box>
    );
  } else if (mode === "adjust") {
    return (
      <>
        <Grid container spacing={2}>
          <Grid item xs={12} md={6} display="flex" justifyContent="center">
            <Box sx={{
              bgcolor: 'background.paper',
              boxShadow: 3,
              borderRadius: 2,
              p: 2,
              minHeight: '100%',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              width: '100%'
            }}>
              <Avatar src={preview} sx={{ width: 256, height: 256, mb: 2 }} />
              <Typography variant="body1" textAlign="center"><strong>Name:</strong> {displayData('name')}</Typography>
              <Typography variant="body1" textAlign="center"><strong>Category:</strong> {displayData('category')}</Typography>
              <Typography variant="body1" textAlign="center"><strong>UPC:</strong> {displayData('upc')}</Typography>
              <Typography variant="body1" textAlign="center"><strong>Quantity:</strong> {displayData('quantity')}</Typography>
              <Typography variant="body1" textAlign="center"><strong>Cost Price:</strong> {displayData('costPrice')}</Typography>
              <Typography variant="body1" textAlign="center"><strong>Sale Price:</strong> {displayData('salePrice')}</Typography>
              <Typography variant="body1" textAlign="center"><strong>Location:</strong> {displayData('location')}</Typography>
            </Box>
          </Grid>
          <Grid item xs={12} md={6}>
            <Box component="form" noValidate autoComplete="off" onChange={handleChange} encType="multipart/form-data">
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
              />
              <FormControl fullWidth margin="normal" error={!!errors.category}>
                <InputLabel id="category-label">Category</InputLabel>
                <Select
                  labelId="category-label"
                  id="category"
                  name="category"
                  value={item.category}
                  onChange={handleChange}
                  error={!!errors.category}
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
                required
                fullWidth
                id="quantity"
                label="Quantity"
                name="quantity"
                type="number"
                value={item.quantity}
                onChange={handleChange}
                error={!!errors.quantity}
                helperText={errors.quantity || ''}
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
              />
              <label htmlFor="icon-button-file">
                <input accept="image/*" id="icon-button-file" type="file" name="file" style={{ display: 'none' }} onChange={handleChange} />
                <IconButton color="primary" aria-label="upload picture" component="span">
                  <PhotoCamera />
                </IconButton>
              </label>
              <Button variant="contained" color="primary" onClick={handleSubmit} sx={{ mt: 2 }} disabled={!isFormValid}>
                Save Changes
              </Button>
            </Box>
          </Grid>
        </Grid>
        <Snackbar open={hookSnackbarOpen} autoHideDuration={6000} onClose={hookCloseSnackbar}>
          <Alert onClose={hookCloseSnackbar} severity="success" sx={{ width: '100%' }}>
            {hookSnackbarMessage}
          </Alert>
        </Snackbar>
      </>
    );
  }
};

export default ProductForm;
