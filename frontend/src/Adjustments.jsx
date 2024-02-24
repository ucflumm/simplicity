import React, { useState, useEffect } from 'react';
import { TextField, Button, FormControl, InputLabel, Select, MenuItem, FormHelperText, Box, Snackbar, Alert, Typography } from '@mui/material';
import axios from 'axios';
import useSnackbar from './hooks/useSnackBar';
import EditIcon from '@mui/icons-material/Edit';

const Adjustments = ({ upc }) => {
  const [item, setItem] = useState({
    name: '',
    category: '',
    upc: '',
    quantity: 0,
    costPrice: 0,
    salePrice: 0,
    location: '',
  });
  const [isEditing, setIsEditing] = useState(false);
  const { open, message, showSnackbar, closeSnackbar } = useSnackbar();

  useEffect(() => {
    // Fetch item details by UPC or name
    fetchItemDetails();
  }, []);

  const fetchItemDetails = async () => {
    try {
      const response = await axios.get(`/api/item/upc/${upc}`);
      setItem(response.data);
    } catch (error) {
      console.log('Error fetching item details:', error);
      showSnackbar('Failed to fetch item details.');
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setItem({ ...item, [name]: value });
  };

  const handleEdit = async (event) => {
    event.preventDefault();

    if (isEditing) {
      // Perform the API call to update the item details
      try {
        await axios.put(`http://localhost:3030/api/item/id/{id}`, item);
        showSnackbar('Item updated successfully!');
        setIsEditing(false); // Exit editing mode
      } catch (error) {
        console.log('Error updating item:', error);
        showSnackbar('Failed to update item.');
      }
    } else {
      setIsEditing(true); // Enter editing mode
    }
  };

  return (
    <>
    <Typography variant="h4" gutterBottom>
      Item Details
      <EditIcon onClick={() => setIsEditing(!isEditing)} />
    </Typography>
    {isEditing ? (
      <Box component="form" noValidate autoComplete="off" onSubmit={handleEdit}>
      <TextField
        margin="normal"
        fullWidth
        id="name"
        label="Name"
        name="name"
        value={item.name}
        onChange={handleChange}
        disabled={!isEditing}
      />
      <FormControl fullWidth margin="normal" disabled={!isEditing}>
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
        </Select>
      </FormControl>
      {/* Other fields similar to above, set disabled={!isEditing} */}
       {/* Quantity Field */}
       <TextField
        margin="normal"
        fullWidth
        id="quantity"
        label="Quantity"
        name="quantity"
        type="number"
        value={item.quantity}
        onChange={handleChange}
        disabled={!isEditing}
      />

      {/* Cost Price Field */}
      <TextField
        margin="normal"
        fullWidth
        id="costPrice"
        label="Cost Price"
        name="costPrice"
        type="number"
        value={item.costPrice}
        onChange={handleChange}
        disabled={!isEditing}
      />

      {/* Sale Price Field */}
      <TextField
        margin="normal"
        fullWidth
        id="salePrice"
        label="Sale Price"
        name="salePrice"
        type="number"
        value={item.salePrice}
        onChange={handleChange}
        disabled={!isEditing}
      />

      {/* Location Field */}
      <TextField
        margin="normal"
        fullWidth
        id="location"
        label="Location"
        name="location"
        value={item.location}
        onChange={handleChange}
        disabled={!isEditing}
      />

      <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 2 }}>
        <Button type="submit" variant="contained" sx={{ mr: 1 }}>
          {isEditing ? 'Save Changes' : 'Edit'}
        </Button>
      </Box>
    </Box>
    ) : (
      <Box>
        <Typography>
          Name: {item.name}
        </Typography>
        <Typography>
          Category: {item.category}
        </Typography>

      </Box>
    )}
      
      <Snackbar open={open} autoHideDuration={6000} onClose={closeSnackbar}>
        <Alert onClose={closeSnackbar} severity="success" sx={{ width: '100%' }}>
          {message}
        </Alert>
      </Snackbar>
    </>
  );
};

export default Adjustments;
